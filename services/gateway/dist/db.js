"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.query = query;
const pg_1 = __importDefault(require("pg"));
const config_js_1 = require("./config.js");
const { Pool } = pg_1.default;
exports.pool = new Pool({
    connectionString: config_js_1.config.databaseUrl,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: config_js_1.config.databaseUrl.includes('supabase') ? { rejectUnauthorized: false } : undefined,
});
async function query(text, params) {
    const start = Date.now();
    const res = await exports.pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.DEBUG_SQL === 'true') {
        console.log('[SQL]', { text, duration, rows: res.rowCount });
    }
    return res;
}
