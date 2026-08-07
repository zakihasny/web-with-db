const ALLOWED_STATEMENTS = /^(SELECT|SHOW|DESCRIBE|DESC|EXPLAIN)\b/i
const SQL_COMMENTS = /(--|#|\/\*|\*\/)/
const DANGEROUS_READ_PATTERNS = [
  /\bINTO\s+(OUTFILE|DUMPFILE)\b/i,
  /\bLOAD_FILE\s*\(/i,
  /\bSLEEP\s*\(/i,
  /\bBENCHMARK\s*\(/i,
  /\bGET_LOCK\s*\(/i,
  /\bRELEASE_LOCK\s*\(/i,
  /\bFOR\s+UPDATE\b/i
]

export function guardReadOnlySql(input: unknown) {
  if (typeof input !== 'string') throw new Error('SQL statement must be text.')

  const trimmed = input.trim()
  if (!trimmed) throw new Error('Enter a SQL statement.')
  if (trimmed.length > 5000) throw new Error('SQL statement must be 5,000 characters or fewer.')
  if (trimmed.includes('\0')) throw new Error('SQL statement contains an invalid character.')
  if (SQL_COMMENTS.test(trimmed)) throw new Error('SQL comments are not accepted in this console.')

  const statement = trimmed.endsWith(';') ? trimmed.slice(0, -1).trim() : trimmed
  if (statement.includes(';')) throw new Error('Only one SQL statement can be executed at a time.')
  if (!ALLOWED_STATEMENTS.test(statement)) {
    throw new Error('Only SELECT, SHOW, DESCRIBE, DESC, and EXPLAIN statements are allowed.')
  }

  if (DANGEROUS_READ_PATTERNS.some((pattern) => pattern.test(statement))) {
    throw new Error('This read operation is not permitted in the testing console.')
  }

  const firstKeyword = statement.match(/^\w+/)?.[0].toUpperCase()
  return firstKeyword === 'SELECT' && !/\bLIMIT\s+\d+/i.test(statement)
    ? `${statement} LIMIT 200`
    : statement
}
