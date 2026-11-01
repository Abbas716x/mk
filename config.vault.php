<?php
/**
 * ==============================================================================
 * RESPAWN Lounge OS (قاعة رسبون) — Configuration Vault Engine
 * File: config.vault.php
 * Architecture: AES-256-CBC Isolated Vault & Multi-Branch Backend Controller
 * Visual Tier: Cyber-Purple Glass Edition (#0E0B1D / #2A1E4D / #5A3B8C)
 * ==============================================================================
 */

declare(strict_types=1);

namespace RespawnLounge\Security;

if (php_sapi_name() !== 'cli' && !defined('RESPAWN_SECURE_BOOTSTRAP')) {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('X-XSS-Protection: 1; mode=block');
}

final class VaultSecurityEngine
{
    private const CIPHER_ALGO = 'AES-256-CBC';
    private const HASH_ALGO = 'sha256';

    private static function getMasterSecret(): string
    {
        return getenv('RESPAWN_VAULT_KEY') ?: 'e7d4a2b9f1c3e5a7b8c0d2e4f6a8b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5';
    }

    public static function encrypt(array $data, string $passphrase = ''): string
    {
        $key = hash(self::HASH_ALGO, $passphrase ?: self::getMasterSecret(), true);
        $ivLength = openssl_cipher_iv_length(self::CIPHER_ALGO);
        $iv = openssl_random_pseudo_bytes($ivLength);
        
        $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $encrypted = openssl_encrypt($json, self::CIPHER_ALGO, $key, OPENSSL_RAW_DATA, $iv);
        $mac = hash_hmac(self::HASH_ALGO, $iv . $encrypted, $key, true);

        return base64_encode($iv . $mac . $encrypted);
    }

    public static function decrypt(string $payloadBase64, string $passphrase = ''): ?array
    {
        $raw = base64_decode($payloadBase64, true);
        if ($raw === false) return null;

        $key = hash(self::HASH_ALGO, $passphrase ?: self::getMasterSecret(), true);
        $ivLength = openssl_cipher_iv_length(self::CIPHER_ALGO);
        $macLength = 32;

        if (strlen($raw) < $ivLength + $macLength) return null;

        $iv = substr($raw, 0, $ivLength);
        $expectedMac = substr($raw, $ivLength, $macLength);
        $encrypted = substr($raw, $ivLength + $macLength);

        $computedMac = hash_hmac(self::HASH_ALGO, $iv . $encrypted, $key, true);
        if (!hash_equals($expectedMac, $computedMac)) {
            return null; // Tamper alert
        }

        $decrypted = openssl_decrypt($encrypted, self::CIPHER_ALGO, $key, OPENSSL_RAW_DATA, $iv);
        return $decrypted !== false ? json_decode($decrypted, true) : null;
    }
}

return [
    'system' => [
        'app_name' => 'RESPAWN Lounge OS',
        'app_name_ar' => 'قاعة رسبون للألعاب والترفيه',
        'version' => '3.5.0-CYBER-PURPLE',
        'visual_theme' => 'CYBER_PURPLE_GLASS',
        'palette' => [
            'base' => '#0E0B1D',
            'deep' => '#2A1E4D',
            'slate' => '#3A3A52',
            'glass_primary' => '#5A3B8C',
            'glass_border' => 'rgba(255, 255, 255, 0.08)',
            'accent' => '#8B7CC7',
            'highlight' => '#C9C2E3',
        ],
        'default_currency' => 'IQD',
        'currency_symbol' => 'د.ع',
        'timezone' => 'Asia/Baghdad',
    ],

    // User Credentials (Admin: 3/3 | Branch Operator: 2/2)
    'credentials_registry' => [
        'super_admin' => [
            'username' => '3',
            'password_hash' => password_hash('3', PASSWORD_BCRYPT),
            'role' => 'SUPER_ADMIN',
            'assigned_branch' => 'all',
            'name' => 'المدير العام (Super Admin)',
            'permissions' => ['all'],
        ],
        'branch_operator' => [
            'username' => '2',
            'password_hash' => password_hash('2', PASSWORD_BCRYPT),
            'role' => 'BRANCH_OPERATOR',
            'assigned_branch' => 'branch_mansour',
            'name' => 'مشغل الصالة والفرع (Branch Operator)',
            'permissions' => ['tables', 'invoices', 'debts', 'orders'],
        ],
    ],

    // Multi-Branch Hierarchy
    'branches' => [
        [
            'id' => 'branch_mansour',
            'name' => 'فرع المنصور الرئيسي (VIP Cyber Lounge)',
            'code' => 'MNS-01',
            'status' => 'active',
            'capacity' => 24,
            'tables_count' => 10,
            'default_hourly_rate' => 5000,
            'address' => 'بغداد - المنصور - شارع الأميرات',
            'created_at' => '2026-01-10T12:00:00Z',
        ],
        [
            'id' => 'branch_karrada',
            'name' => 'فرع الكرادة (Cyber Arena)',
            'code' => 'KRD-02',
            'status' => 'active',
            'capacity' => 30,
            'tables_count' => 8,
            'default_hourly_rate' => 4500,
            'address' => 'بغداد - الكرادة داخل - تقاطع مسبح',
            'created_at' => '2026-02-15T14:30:00Z',
        ],
        [
            'id' => 'branch_zayouna',
            'name' => 'فرع زيونة (Grand Lounge)',
            'code' => 'ZYN-03',
            'status' => 'active',
            'capacity' => 20,
            'tables_count' => 8,
            'default_hourly_rate' => 4000,
            'address' => 'بغداد - زيونة - مقابل المدينة المائية',
            'created_at' => '2026-03-01T10:00:00Z',
        ],
    ],

    // Firebase Realtime Database
    'firebase' => [
        'database_url' => getenv('FIREBASE_RTDB_URL') ?: 'https://respawn-lounge-default-rtdb.firebaseio.com',
        'project_id' => getenv('FIREBASE_PROJECT_ID') ?: 'respawn-lounge-core',
        'auth_domain' => getenv('FIREBASE_AUTH_DOMAIN') ?: 'respawn-lounge-core.firebaseapp.com',
        'sync_interval_ms' => 50,
        'channels' => [
            'tables' => 'respawn_v3/tables',
            'sessions' => 'respawn_v3/sessions',
            'invoices' => 'respawn_v3/invoices',
            'debts' => 'respawn_v3/debts',
            'audit' => 'respawn_v3/audit_logs',
            'branches' => 'respawn_v3/branches',
        ]
    ]
];
