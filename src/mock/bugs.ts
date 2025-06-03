import type { Bug } from '../types/bug.ts'

// Helper to create dates in the past (days ago)
const daysAgo = (days: number): string => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

export const bugs: Bug[] = [
  {
    id: 'b1',
    title: 'Abacus ERP File Read (CVE-2025-0001)',
    description:
      'Abacus ERP versions older than 2024.210.16036 allow authenticated arbitrary file read.',
    bounty: 200,
    pto: 8,
    active: true,
    createdAt: daysAgo(6),
    priority: 'high',
  },
  {
    id: 'b2',
    title: 'Mali GPU Out-of-Bounds (CVE-2025-0050)',
    description:
      'Improper bounds checking in Arm GPU drivers lets a user access memory past buffer limits.',
    bounty: 80,
    pto: 3,
    active: true,
    createdAt: daysAgo(6),
    priority: 'medium',
  },
  {
    id: 'b3',
    title: 'SAP GUI Info Leak (CVE-2025-0055)',
    description:
      "Cached user input can be read by attackers with access to the victim's user directory.",
    bounty: 50,
    pto: 2,
    active: true,
    createdAt: daysAgo(5),
    priority: 'low',
  },
  {
    id: 'b4',
    title: 'Eyewear Shop SQLi (CVE-2025-0173)',
    description:
      'The id parameter in view_order.php allows SQL injection in SourceCodester Online Eyewear Shop.',
    bounty: 120,
    pto: 4,
    active: true,
    createdAt: daysAgo(5),
    priority: 'medium',
  },
  {
    id: 'b5',
    title: 'TMD Header Menu SQLi (CVE-2025-0214)',
    description:
      'Headermenu_id in admin/index.php of TMD Custom Header Menu is vulnerable to SQL injection.',
    bounty: 70,
    pto: 2,
    active: true,
    createdAt: daysAgo(4),
    priority: 'low',
  },
  {
    id: 'b6',
    title: 'ENOVIA XSS (CVE-2025-0600)',
    description:
      'Stored XSS in ENOVIA Product Explorer lets attackers execute scripts in user sessions.',
    bounty: 150,
    pto: 6,
    active: true,
    createdAt: daysAgo(3),
    priority: 'high',
  },
  {
    id: 'b7',
    title: 'PAN-OS File Peek (CVE-2025-0111)',
    description:
      'Authenticated users could read system files via the management web interface.',
    bounty: 60,
    pto: 1,
    active: true,
    createdAt: daysAgo(2),
    priority: 'low',
  },
  {
    id: 'b8',
    title: 'Tailoring System SQLi (CVE-2025-0944)',
    description:
      'Customerview.php in Tailoring Management System has an id parameter vulnerable to SQL injection.',
    bounty: 90,
    pto: 3,
    active: true,
    createdAt: daysAgo(1),
    priority: 'medium',
  },
  {
    id: 'b9',
    title: 'PAN-OS GlobalProtect RCE (CVE-2024-3400)',
    description:
      'Arbitrary file creation in GlobalProtect can lead to command execution on the firewall.',
    bounty: 110,
    pto: 4,
    active: true,
    createdAt: daysAgo(1),
    priority: 'medium',
  },
  {
    id: 'b10',
    title: 'xz Backdoor (CVE-2024-3094)',
    description:
      'Malicious code in xz 5.6.0+ modifies liblzma to intercept and alter data.',
    bounty: 130,
    pto: 5,
    active: true,
    createdAt: daysAgo(0),
    priority: 'high',
  },
  {
    id: 'b11',
    title: 'FileCatalyst Workflow RCE (CVE-2024-25153)',
    description:
      'Directory traversal in the ftpservlet allows file uploads that enable remote code execution.',
    bounty: 75,
    pto: 2,
    active: true,
    createdAt: daysAgo(0),
    priority: 'medium',
  },
  {
    id: 'b12',
    title: 'mailcow XSS (CVE-2024-31204)',
    description:
      'Unsanitized exception details render in the admin panel, allowing cross-site scripting.',
    bounty: 300,
    pto: 8,
    active: true,
    createdAt: daysAgo(0),
    priority: 'high',
  },
]
