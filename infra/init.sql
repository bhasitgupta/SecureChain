-- SIH26125 Database Schema
-- Run automatically by docker-compose init

-- Identity cache (from chain events)
CREATE TABLE IF NOT EXISTS identities (
    did_hash        TEXT PRIMARY KEY,
    did             TEXT NOT NULL,
    subject_id      TEXT NOT NULL DEFAULT '',
    account         TEXT NOT NULL UNIQUE,
    status          TEXT NOT NULL DEFAULT 'Active',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
    document_id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    owner_address       TEXT NOT NULL,
    title               TEXT NOT NULL,
    latest_version_id   TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Document versions (INSERT only — trigger blocks UPDATE on immutable cols)
CREATE TABLE IF NOT EXISTS document_versions (
    version_id      TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    document_id     TEXT NOT NULL REFERENCES documents(document_id),
    seq             INTEGER NOT NULL DEFAULT 1,
    file_name       TEXT NOT NULL,
    mime_type       TEXT NOT NULL DEFAULT 'application/octet-stream',
    size_bytes      BIGINT NOT NULL DEFAULT 0,
    sha256          TEXT,
    minio_key       TEXT NOT NULL,
    minio_version_id TEXT,
    state           TEXT NOT NULL DEFAULT 'UPLOADING',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doc_versions_doc ON document_versions(document_id);

-- Immutability trigger: block UPDATE on sha256, minio_version_id, version_id
CREATE OR REPLACE FUNCTION prevent_version_mutation() RETURNS TRIGGER AS $$
BEGIN
    IF OLD.sha256 IS NOT NULL AND NEW.sha256 != OLD.sha256 THEN
        RAISE EXCEPTION 'Cannot mutate sha256 on document_versions';
    END IF;
    IF OLD.minio_version_id IS NOT NULL AND NEW.minio_version_id != OLD.minio_version_id THEN
        RAISE EXCEPTION 'Cannot mutate minio_version_id on document_versions';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_version_immutable ON document_versions;
CREATE TRIGGER trg_version_immutable
    BEFORE UPDATE ON document_versions
    FOR EACH ROW EXECUTE FUNCTION prevent_version_mutation();

-- Proof records
CREATE TABLE IF NOT EXISTS proof_records (
    version_id      TEXT PRIMARY KEY REFERENCES document_versions(version_id),
    leaf_hash       TEXT,
    batch_id        TEXT,
    leaf_index      INTEGER,
    proof_json      JSONB,
    status          TEXT NOT NULL DEFAULT 'PENDING'
);

-- Merkle batches
CREATE TABLE IF NOT EXISTS merkle_batches (
    batch_id        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    root            TEXT,
    leaf_count      INTEGER NOT NULL DEFAULT 0,
    closed_at       TIMESTAMPTZ,
    anchor_tx       TEXT,
    anchor_block    BIGINT,
    status          TEXT NOT NULL DEFAULT 'OPEN'
);

-- Asset thumbnails
CREATE TABLE IF NOT EXISTS asset_thumbnails (
    token_id        TEXT PRIMARY KEY,
    minio_key       TEXT NOT NULL,
    mime_type       TEXT NOT NULL DEFAULT 'image/webp',
    width           INTEGER,
    height          INTEGER,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Document thumbnails
CREATE TABLE IF NOT EXISTS doc_thumbnails (
    version_id      TEXT PRIMARY KEY REFERENCES document_versions(version_id),
    minio_key       TEXT NOT NULL,
    mime_type       TEXT NOT NULL DEFAULT 'image/webp',
    status          TEXT NOT NULL DEFAULT 'PENDING',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Transactional outbox
CREATE TABLE IF NOT EXISTS outbox (
    id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    aggregate_type  TEXT NOT NULL,
    aggregate_id    TEXT NOT NULL,
    event_type      TEXT NOT NULL,
    payload         JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_outbox_unprocessed ON outbox(created_at) WHERE processed_at IS NULL;

-- Audit events (from indexer)
CREATE TABLE IF NOT EXISTS audit_events (
    id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    contract_addr   TEXT NOT NULL,
    event_name      TEXT NOT NULL,
    block_number    BIGINT NOT NULL,
    tx_hash         TEXT NOT NULL,
    log_index       INTEGER NOT NULL DEFAULT 0,
    decoded         JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tx_hash, log_index)
);

CREATE INDEX IF NOT EXISTS idx_audit_block ON audit_events(block_number);
CREATE INDEX IF NOT EXISTS idx_audit_event ON audit_events(event_name);

-- Indexer checkpoints
CREATE TABLE IF NOT EXISTS indexer_checkpoints (
    contract_address TEXT PRIMARY KEY,
    last_block       BIGINT NOT NULL DEFAULT 0,
    last_log_index   INTEGER NOT NULL DEFAULT 0,
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Latest version history (append-only)
CREATE TABLE IF NOT EXISTS latest_version_history (
    id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    document_id     TEXT NOT NULL REFERENCES documents(document_id),
    from_version    TEXT,
    to_version      TEXT NOT NULL,
    actor           TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
