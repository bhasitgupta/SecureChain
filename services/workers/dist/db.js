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
    max: 10,
    ssl: config_js_1.config.databaseUrl.includes('supabase') ? { rejectUnauthorized: false } : undefined,
});
async function query(text, params) {
    return exports.pool.query(text, params);
}
