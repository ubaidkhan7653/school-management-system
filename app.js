const {
    useState,
    useEffect,
    useRef,
    useCallback,
    createContext,
    useContext
} = React;

// ─── Context ───────────────────────────────────────────────────────────────
const AppContext = createContext();

// ─── Initial Data ──────────────────────────────────────────────────────────
const ROLES = ['admin', 'teacher', 'student', 'staff', 'accountant'];
const PERMISSIONS = ['dashboard', 'students', 'teachers', 'attendance', 'fees', 'exams', 'results', 'inventory', 'reports', 'settings', 'users'];
const localDateString = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// ─── Photo URLs: pravatar.cc gives consistent photos by seed ───────────────
// Users: seed = user id (male seeds: 11,12,14,15,16; female: 21,22,24,25)
// Students: male seeds 30-40, female seeds 50-60
// Teachers: mixed seeds 60-70
const IMG = (seed, size = 80) => `https://i.pravatar.cc/${size}?img=${seed}`;
const initUsers = [{
    id: 1,
    name: 'Ahmad Hassan',
    email: 'admin@school.edu',
    role: 'admin',
    username: 'admin',
    password: 'admin123',
    status: 'active',
    avatar: 'AH',
    imgSeed: 11,
    joined: '2023-01-01',
    permissions: PERMISSIONS
}, {
    id: 2,
    name: 'Sara Malik',
    email: 'sara@school.edu',
    role: 'teacher',
    username: 'sara',
    password: 'sara123',
    status: 'active',
    avatar: 'SM',
    imgSeed: 47,
    joined: '2023-03-15',
    permissions: ['dashboard', 'students', 'attendance', 'exams', 'results']
}, {
    id: 3,
    name: 'Ali Khan',
    email: 'ali@school.edu',
    role: 'student',
    username: 'ali',
    password: 'ali123',
    status: 'active',
    avatar: 'AK',
    imgSeed: 12,
    joined: '2024-01-10',
    permissions: ['dashboard']
}, {
    id: 4,
    name: 'Fatima Zahra',
    email: 'fatima@school.edu',
    role: 'staff',
    username: 'fatima',
    password: 'fatima123',
    status: 'active',
    avatar: 'FZ',
    imgSeed: 44,
    joined: '2023-06-20',
    permissions: ['dashboard', 'attendance', 'inventory']
}, {
    id: 5,
    name: 'Omar Sheikh',
    email: 'omar@school.edu',
    role: 'accountant',
    username: 'omar',
    password: 'omar123',
    status: 'active',
    avatar: 'OS',
    imgSeed: 15,
    joined: '2023-09-01',
    permissions: ['dashboard', 'fees', 'reports']
}];
const initStudents = [{
    id: 1,
    admNo: 'SMS-2024-001',
    name: 'Ali Khan',
    father: 'Imran Khan',
    mother: 'Sana Khan',
    class: '10',
    section: 'A',
    dob: '2008-05-14',
    phone: '0300-1234567',
    email: 'ali.k@student.edu',
    address: 'House 45, Block B, Karachi',
    status: 'active',
    fees: 'paid',
    rollNo: '1001',
    photo: 'AK',
    imgSeed: 12
}, {
    id: 2,
    admNo: 'SMS-2024-002',
    name: 'Ayesha Noor',
    father: 'Tariq Noor',
    mother: 'Rabia Noor',
    class: '10',
    section: 'B',
    dob: '2008-09-22',
    phone: '0312-9876543',
    email: 'ayesha.n@student.edu',
    address: 'Plot 12, Gulshan, Karachi',
    status: 'active',
    fees: 'unpaid',
    rollNo: '1002',
    photo: 'AN',
    imgSeed: 54
}, {
    id: 3,
    admNo: 'SMS-2024-003',
    name: 'Zain Ahmed',
    father: 'Khalid Ahmed',
    mother: 'Hina Ahmed',
    class: '9',
    section: 'A',
    dob: '2009-02-10',
    phone: '0333-4567890',
    email: 'zain.a@student.edu',
    address: 'Street 7, PECHS, Karachi',
    status: 'active',
    fees: 'paid',
    rollNo: '903',
    photo: 'ZA',
    imgSeed: 13
}, {
    id: 4,
    admNo: 'SMS-2024-004',
    name: 'Sana Raza',
    father: 'Irfan Raza',
    mother: 'Bushra Raza',
    class: '9',
    section: 'B',
    dob: '2009-11-30',
    phone: '0321-2345678',
    email: 'sana.r@student.edu',
    address: 'Lane 3, DHA, Karachi',
    status: 'inactive',
    fees: 'partial',
    rollNo: '904',
    photo: 'SR',
    imgSeed: 56
}, {
    id: 5,
    admNo: 'SMS-2024-005',
    name: 'Hamza Butt',
    father: 'Waqar Butt',
    mother: 'Asma Butt',
    class: '8',
    section: 'A',
    dob: '2010-07-18',
    phone: '0345-8765432',
    email: 'hamza.b@student.edu',
    address: 'House 88, Clifton, Karachi',
    status: 'active',
    fees: 'paid',
    rollNo: '805',
    photo: 'HB',
    imgSeed: 16
}, {
    id: 6,
    admNo: 'SMS-2024-006',
    name: 'Mariam Shah',
    father: 'Naeem Shah',
    mother: 'Farah Shah',
    class: '8',
    section: 'B',
    dob: '2010-04-25',
    phone: '0315-3456789',
    email: 'mariam.s@student.edu',
    address: 'Flat 5B, North Nazimabad, Karachi',
    status: 'active',
    fees: 'unpaid',
    rollNo: '806',
    photo: 'MS',
    imgSeed: 58
}];
const initTeachers = [{
    id: 1,
    name: 'Sara Malik',
    subject: 'Mathematics',
    class: '10',
    qualification: 'MSc Math',
    phone: '0300-1111111',
    email: 'sara@school.edu',
    status: 'active',
    salary: 65000,
    joined: '2020-08-01',
    photo: 'SM',
    imgSeed: 47
}, {
    id: 2,
    name: 'Bilal Hussain',
    subject: 'English',
    class: '9,10',
    qualification: 'MA English',
    phone: '0312-2222222',
    email: 'bilal@school.edu',
    status: 'active',
    salary: 60000,
    joined: '2019-04-15',
    photo: 'BH',
    imgSeed: 14
}, {
    id: 3,
    name: 'Nadia Aziz',
    subject: 'Science',
    class: '8,9',
    qualification: 'BSc Biology',
    phone: '0333-3333333',
    email: 'nadia@school.edu',
    status: 'active',
    salary: 58000,
    joined: '2021-01-10',
    photo: 'NA',
    imgSeed: 48
}, {
    id: 4,
    name: 'Kashif Mehmood',
    subject: 'Urdu',
    class: '8,9,10',
    qualification: 'MA Urdu',
    phone: '0321-4444444',
    email: 'kashif@school.edu',
    status: 'active',
    salary: 55000,
    joined: '2018-09-01',
    photo: 'KM',
    imgSeed: 17
}];
const initAttendance = [{
    id: 1,
    studentId: 1,
    studentName: 'Ali Khan',
    class: '10A',
    date: '2025-05-27',
    status: 'present'
}, {
    id: 2,
    studentId: 2,
    studentName: 'Ayesha Noor',
    class: '10B',
    date: '2025-05-27',
    status: 'absent'
}, {
    id: 3,
    studentId: 3,
    studentName: 'Zain Ahmed',
    class: '9A',
    date: '2025-05-27',
    status: 'present'
}, {
    id: 4,
    studentId: 4,
    studentName: 'Sana Raza',
    class: '9B',
    date: '2025-05-27',
    status: 'late'
}, {
    id: 5,
    studentId: 5,
    studentName: 'Hamza Butt',
    class: '8A',
    date: '2025-05-27',
    status: 'present'
}, {
    id: 6,
    studentId: 6,
    studentName: 'Mariam Shah',
    class: '8B',
    date: '2025-05-27',
    status: 'present'
}];
const initFees = [{
    id: 1,
    studentId: 1,
    studentName: 'Ali Khan',
    class: '10A',
    month: 'May 2025',
    amount: 8500,
    paid: 8500,
    balance: 0,
    status: 'paid',
    dueDate: '2025-05-10',
    paidDate: '2025-05-05',
    receipt: 'RCP-1001'
}, {
    id: 2,
    studentId: 2,
    studentName: 'Ayesha Noor',
    class: '10B',
    month: 'May 2025',
    amount: 8500,
    paid: 0,
    balance: 8500,
    status: 'unpaid',
    dueDate: '2025-05-10',
    paidDate: null,
    receipt: null
}, {
    id: 3,
    studentId: 3,
    studentName: 'Zain Ahmed',
    class: '9A',
    month: 'May 2025',
    amount: 7500,
    paid: 7500,
    balance: 0,
    status: 'paid',
    dueDate: '2025-05-10',
    paidDate: '2025-05-08',
    receipt: 'RCP-1002'
}, {
    id: 4,
    studentId: 4,
    studentName: 'Sana Raza',
    class: '9B',
    month: 'May 2025',
    amount: 7500,
    paid: 4000,
    balance: 3500,
    status: 'partial',
    dueDate: '2025-05-10',
    paidDate: '2025-05-12',
    receipt: 'RCP-1003'
}, {
    id: 5,
    studentId: 5,
    studentName: 'Hamza Butt',
    class: '8A',
    month: 'May 2025',
    amount: 7000,
    paid: 7000,
    balance: 0,
    status: 'paid',
    dueDate: '2025-05-10',
    paidDate: '2025-05-07',
    receipt: 'RCP-1004'
}, {
    id: 6,
    studentId: 6,
    studentName: 'Mariam Shah',
    class: '8B',
    month: 'May 2025',
    amount: 7000,
    paid: 0,
    balance: 7000,
    status: 'unpaid',
    dueDate: '2025-05-10',
    paidDate: null,
    receipt: null
}];
const initExams = [{
    id: 1,
    name: 'Mid-Term Examination',
    class: '10',
    subject: 'Mathematics',
    date: '2025-06-10',
    maxMarks: 100,
    passMarks: 40,
    status: 'upcoming'
}, {
    id: 2,
    name: 'Mid-Term Examination',
    class: '10',
    subject: 'English',
    date: '2025-06-11',
    maxMarks: 100,
    passMarks: 40,
    status: 'upcoming'
}, {
    id: 3,
    name: 'Unit Test 3',
    class: '9',
    subject: 'Science',
    date: '2025-05-28',
    maxMarks: 50,
    passMarks: 20,
    status: 'ongoing'
}, {
    id: 4,
    name: 'Weekly Test',
    class: '8',
    subject: 'Urdu',
    date: '2025-05-20',
    maxMarks: 25,
    passMarks: 10,
    status: 'completed'
}];
const initResults = [{
    id: 1,
    studentId: 1,
    studentName: 'Ali Khan',
    class: '10A',
    examName: 'Unit Test 2',
    subject: 'Mathematics',
    marksObtained: 88,
    maxMarks: 100,
    grade: 'A',
    remarks: 'Excellent'
}, {
    id: 2,
    studentId: 2,
    studentName: 'Ayesha Noor',
    class: '10B',
    examName: 'Unit Test 2',
    subject: 'Mathematics',
    marksObtained: 72,
    maxMarks: 100,
    grade: 'B',
    remarks: 'Good'
}, {
    id: 3,
    studentId: 3,
    studentName: 'Zain Ahmed',
    class: '9A',
    examName: 'Unit Test 2',
    subject: 'Science',
    marksObtained: 65,
    maxMarks: 100,
    grade: 'C',
    remarks: 'Satisfactory'
}, {
    id: 4,
    studentId: 5,
    studentName: 'Hamza Butt',
    class: '8A',
    examName: 'Weekly Test',
    subject: 'Urdu',
    marksObtained: 22,
    maxMarks: 25,
    grade: 'A+',
    remarks: 'Outstanding'
}];
const initInventory = [{
    id: 1,
    category: 'Furniture',
    name: 'Student Desks',
    sku: 'FUR-001',
    quantity: 120,
    minStock: 20,
    unitPrice: 4500,
    supplier: 'Ali Furniture',
    lastPurchase: '2024-12-01',
    location: 'Storeroom A',
    status: 'in-stock'
}, {
    id: 2,
    category: 'Furniture',
    name: 'Chairs',
    sku: 'FUR-002',
    quantity: 115,
    minStock: 20,
    unitPrice: 2200,
    supplier: 'Ali Furniture',
    lastPurchase: '2024-12-01',
    location: 'Storeroom A',
    status: 'in-stock'
}, {
    id: 3,
    category: 'Technology',
    name: 'Computers',
    sku: 'TEC-001',
    quantity: 35,
    minStock: 10,
    unitPrice: 85000,
    supplier: 'Tech World',
    lastPurchase: '2024-10-15',
    location: 'Computer Lab',
    status: 'in-stock'
}, {
    id: 4,
    category: 'Stationery',
    name: 'Notebooks',
    sku: 'STA-001',
    quantity: 8,
    minStock: 50,
    unitPrice: 120,
    supplier: 'Stationers Hub',
    lastPurchase: '2025-04-10',
    location: 'Storeroom B',
    status: 'low-stock'
}, {
    id: 5,
    category: 'Uniform',
    name: 'School Uniform (Boys)',
    sku: 'UNI-001',
    quantity: 45,
    minStock: 30,
    unitPrice: 1800,
    supplier: 'Garments Co',
    lastPurchase: '2025-01-20',
    location: 'Storeroom C',
    status: 'in-stock'
}, {
    id: 6,
    category: 'Uniform',
    name: 'School Uniform (Girls)',
    sku: 'UNI-002',
    quantity: 12,
    minStock: 30,
    unitPrice: 2000,
    supplier: 'Garments Co',
    lastPurchase: '2025-01-20',
    location: 'Storeroom C',
    status: 'low-stock'
}, {
    id: 7,
    category: 'Books',
    name: 'Mathematics Textbook Gr.10',
    sku: 'BOK-001',
    quantity: 0,
    minStock: 20,
    unitPrice: 650,
    supplier: 'Book Depot',
    lastPurchase: '2024-09-01',
    location: 'Library',
    status: 'out-of-stock'
}, {
    id: 8,
    category: 'Sports',
    name: 'Footballs',
    sku: 'SPO-001',
    quantity: 20,
    minStock: 5,
    unitPrice: 1200,
    supplier: 'Sports Zone',
    lastPurchase: '2025-02-28',
    location: 'Sports Room',
    status: 'in-stock'
}, {
    id: 9,
    category: 'Lab',
    name: 'Microscopes',
    sku: 'LAB-001',
    quantity: 15,
    minStock: 8,
    unitPrice: 25000,
    supplier: 'Science Supplies',
    lastPurchase: '2024-11-10',
    location: 'Biology Lab',
    status: 'in-stock'
}];
const initNotifications = [{
    id: 1,
    type: 'warning',
    message: 'Low stock alert: Notebooks (8 remaining)',
    time: '2 hours ago',
    read: false
}, {
    id: 2,
    type: 'info',
    message: 'Mid-Term exams scheduled for June 10-15',
    time: '5 hours ago',
    read: false
}, {
    id: 3,
    type: 'danger',
    message: '6 students with unpaid fees for May 2025',
    time: '1 day ago',
    read: false
}, {
    id: 4,
    type: 'success',
    message: 'Monthly attendance report generated',
    time: '2 days ago',
    read: true
}, {
    id: 5,
    type: 'info',
    message: 'New student Ali Raza registered',
    time: '3 days ago',
    read: true
}];

// ─── Icons ─────────────────────────────────────────────────────────────────
const Icon = ({
    n,
    s = 17,
    c
}) => /*#__PURE__*/ React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: c,
    style: { flexShrink: 0 }
}, n === 'home' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("path", {
    d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
}), /*#__PURE__*/ React.createElement("polyline", {
    points: "9 22 9 12 15 12 15 22"
})), n === 'users' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("path", {
    d: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
}), /*#__PURE__*/ React.createElement("circle", {
    cx: "9",
    cy: "7",
    r: "4"
}), /*#__PURE__*/ React.createElement("path", {
    d: "M22 10v6M2 10l10-5 10 5-10 5z"
}), /*#__PURE__*/ React.createElement("path", {
    d: "M6 12v5c3 3 9 3 12 0v-5"
})), n === 'upload' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("path", {
    d: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
}), /*#__PURE__*/ React.createElement("polyline", {
    points: "17 8 12 3 7 8"
}), /*#__PURE__*/ React.createElement("line", {
    x1: "12",
    y1: "3",
    x2: "12",
    y2: "15"
})), n === 'teacher' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("path", {
    d: "M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"
}), /*#__PURE__*/ React.createElement("path", {
    d: "M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
})), n === 'attendance' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("rect", {
    x: "3",
    y: "4",
    width: "18",
    height: "18",
    rx: "2"
}), /*#__PURE__*/ React.createElement("line", {
    x1: "16",
    y1: "2",
    x2: "16",
    y2: "6"
}), /*#__PURE__*/ React.createElement("line", {
    x1: "8",
    y1: "2",
    x2: "8",
    y2: "6"
}), /*#__PURE__*/ React.createElement("line", {
    x1: "3",
    y1: "10",
    x2: "21",
    y2: "10"
}), /*#__PURE__*/ React.createElement("path", {
    d: "M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"
})), n === 'fee' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("line", {
    x1: "12",
    y1: "1",
    x2: "12",
    y2: "23"
}), /*#__PURE__*/ React.createElement("path", {
    d: "M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
})), n === 'exam' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("path", {
    d: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
}), /*#__PURE__*/ React.createElement("polyline", {
    points: "14 2 14 8 20 8"
}), /*#__PURE__*/ React.createElement("line", {
    x1: "16",
    y1: "13",
    x2: "8",
    y2: "13"
}), /*#__PURE__*/ React.createElement("line", {
    x1: "16",
    y1: "17",
    x2: "8",
    y2: "17"
}), /*#__PURE__*/ React.createElement("polyline", {
    points: "10 9 9 9 8 9"
})), n === 'result' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("polyline", {
    points: "22 12 18 12 15 21 9 3 6 12 2 12"
})), n === 'inventory' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("path", {
    d: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
}), /*#__PURE__*/ React.createElement("polyline", {
    points: "3.27 6.96 12 12.01 20.73 6.96"
}), /*#__PURE__*/ React.createElement("line", {
    x1: "12",
    y1: "22.08",
    x2: "12",
    y2: "12"
})), n === 'report' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("path", {
    d: "M18 20V10"
}), /*#__PURE__*/ React.createElement("path", {
    d: "M12 20V4"
}), /*#__PURE__*/ React.createElement("path", {
    d: "M6 20v-6"
})), n === 'settings' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
}), /*#__PURE__*/ React.createElement("path", {
    d: "M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
})), n === 'bell' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("path", {
    d: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"
}), /*#__PURE__*/ React.createElement("path", {
    d: "M13.73 21a2 2 0 01-3.46 0"
})), n === 'search' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "8"
}), /*#__PURE__*/ React.createElement("line", {
    x1: "21",
    y1: "21",
    x2: "16.65",
    y2: "16.65"
})), n === 'teacher' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("path", {
    d: "M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"
}), /*#__PURE__*/ React.createElement("path", {
    d: "M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
}), /*#__PURE__*/ React.createElement("line", {
    x1: "12",
    y1: "12",
    x2: "12",
    y2: "12"
}), /*#__PURE__*/ React.createElement("path", {
    d: "M12 12h.01"
})), n === 'attendance' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("rect", {
    x: "3",
    y: "4",
    width: "18",
    height: "18",
    rx: "2"
}), /*#__PURE__*/ React.createElement("line", {
    x1: "16",
    y1: "2",
    x2: "16",
    y2: "6"
}), /*#__PURE__*/ React.createElement("line", {
    x1: "8",
    y1: "2",
    x2: "8",
    y2: "6"
}), /*#__PURE__*/ React.createElement("line", {
    x1: "3",
    y1: "10",
    x2: "21",
    y2: "10"
}), /*#__PURE__*/ React.createElement("path", {
    d: "M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"
})), n === 'plus' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("line", {
    x1: "12",
    y1: "5",
    x2: "12",
    y2: "19"
}), /*#__PURE__*/ React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
})), n === 'edit' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("path", {
    d: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
}), /*#__PURE__*/ React.createElement("path", {
    d: "M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
})), n === 'trash' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("polyline", {
    points: "3 6 5 6 21 6"
}), /*#__PURE__*/ React.createElement("path", {
    d: "M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
}), /*#__PURE__*/ React.createElement("path", {
    d: "M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"
})), n === 'eye' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("path", {
    d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
}), /*#__PURE__*/ React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
})), n === 'logout' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("path", {
    d: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
}), /*#__PURE__*/ React.createElement("polyline", {
    points: "16 17 21 12 16 7"
}), /*#__PURE__*/ React.createElement("line", {
    x1: "21",
    y1: "12",
    x2: "9",
    y2: "12"
})), n === 'menu' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("line", {
    x1: "3",
    y1: "12",
    x2: "21",
    y2: "12"
}), /*#__PURE__*/ React.createElement("line", {
    x1: "3",
    y1: "6",
    x2: "21",
    y2: "6"
}), /*#__PURE__*/ React.createElement("line", {
    x1: "3",
    y1: "18",
    x2: "21",
    y2: "18"
})), n === 'x' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
}), /*#__PURE__*/ React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
})), n === 'check' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("polyline", {
    points: "20 6 9 17 4 12"
})), n === 'alert' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("path", {
    d: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
}), /*#__PURE__*/ React.createElement("line", {
    x1: "12",
    y1: "9",
    x2: "12",
    y2: "13"
}), /*#__PURE__*/ React.createElement("line", {
    x1: "12",
    y1: "17",
    x2: "12.01",
    y2: "17"
})), n === 'download' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("path", {
    d: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
}), /*#__PURE__*/ React.createElement("polyline", {
    points: "7 10 12 15 17 10"
}), /*#__PURE__*/ React.createElement("line", {
    x1: "12",
    y1: "15",
    x2: "12",
    y2: "3"
})), n === 'shield' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("path", {
    d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
})), n === 'key' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("path", {
    d: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"
})), n === 'lock' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("rect", {
    x: "3",
    y: "11",
    width: "18",
    height: "11",
    rx: "2",
    ry: "2"
}), /*#__PURE__*/ React.createElement("path", {
    d: "M7 11V7a5 5 0 0110 0v4"
})), n === 'chart' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("line", {
    x1: "18",
    y1: "20",
    x2: "18",
    y2: "10"
}), /*#__PURE__*/ React.createElement("line", {
    x1: "12",
    y1: "20",
    x2: "12",
    y2: "4"
}), /*#__PURE__*/ React.createElement("line", {
    x1: "6",
    y1: "20",
    x2: "6",
    y2: "14"
})), n === 'print' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("polyline", {
    points: "6 9 6 2 18 2 18 9"
}), /*#__PURE__*/ React.createElement("path", {
    d: "M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"
}), /*#__PURE__*/ React.createElement("rect", {
    x: "6",
    y: "14",
    width: "12",
    height: "8"
})), n === 'info' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
}), /*#__PURE__*/ React.createElement("line", {
    x1: "12",
    y1: "16",
    x2: "12",
    y2: "12"
}), /*#__PURE__*/ React.createElement("line", {
    x1: "12",
    y1: "8",
    x2: "12.01",
    y2: "8"
})), n === 'pkg' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("line", {
    x1: "16.5",
    y1: "9.4",
    x2: "7.5",
    y2: "4.21"
}), /*#__PURE__*/ React.createElement("path", {
    d: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
}), /*#__PURE__*/ React.createElement("polyline", {
    points: "3.27 6.96 12 12.01 20.73 6.96"
}), /*#__PURE__*/ React.createElement("line", {
    x1: "12",
    y1: "22.08",
    x2: "12",
    y2: "12"
})), n === 'arrow-right' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
}), /*#__PURE__*/ React.createElement("polyline", {
    points: "12 5 19 12 12 19"
})), n === 'refresh' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("polyline", {
    points: "23 4 23 10 17 10"
}), /*#__PURE__*/ React.createElement("polyline", {
    points: "1 20 1 14 7 14"
}), /*#__PURE__*/ React.createElement("path", {
    d: "M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"
})), n === 'star' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("polygon", {
    points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
})), n === 'mail' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("path", {
    d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
}), /*#__PURE__*/ React.createElement("polyline", {
    points: "22 6 12 13 2 6"
})), n === 'phone' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("path", {
    d: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
})), n === 'gift' && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("polyline", {
    points: "20 12 20 22 4 22 4 12"
}), /*#__PURE__*/ React.createElement("rect", {
    x: "2",
    y: "7",
    width: "20",
    height: "5"
}), /*#__PURE__*/ React.createElement("line", {
    x1: "12",
    y1: "22",
    x2: "12",
    y2: "7"
}), /*#__PURE__*/ React.createElement("path", {
    d: "M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"
}), /*#__PURE__*/ React.createElement("path", {
    d: "M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"
})));

// ─── Avatar ────────────────────────────────────────────────────────────────
const Avatar = ({
    initials,
    size = 36,
    color = 'blue',
    imgSeed,
    image
}) => {
    const [imgErr, setImgErr] = useState(false);
    const colors = {
        blue: '#4f8ef7',
        green: '#34d399',
        amber: '#fbbf24',
        purple: '#a78bfa',
        pink: '#f472b6',
        cyan: '#22d3ee',
        red: '#f87171'
    };
    const bgs = {
        blue: 'rgba(79,142,247,0.18)',
        green: 'rgba(52,211,153,0.18)',
        amber: 'rgba(251,191,36,0.18)',
        purple: 'rgba(167,139,250,0.18)',
        pink: 'rgba(244,114,182,0.18)',
        cyan: 'rgba(34,211,238,0.18)',
        red: 'rgba(248,113,113,0.18)'
    };
    const baseStyle = {
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };
    if ((image || imgSeed) && !imgErr) {
        return /*#__PURE__*/ React.createElement("div", {
            style: {
                ...baseStyle,
                background: bgs[color] || bgs.blue,
                border: `2px solid ${colors[color] || colors.blue}30`,
                boxSizing: 'border-box'
            }
        }, /*#__PURE__*/ React.createElement("img", {
            src: image || `https://i.pravatar.cc/${size * 2}?img=${imgSeed}`,
            alt: initials,
            onError: () => setImgErr(true),
            style: {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%'
            }
        }));
    }
    return /*#__PURE__*/ React.createElement("div", {
        style: {
            ...baseStyle,
            background: bgs[color] || bgs.blue,
            color: colors[color] || colors.blue,
            fontSize: size * 0.33,
            fontWeight: 600
        }
    }, initials);
};

const ImageUpload = ({
    value,
    onChange
}) => {
    const [error, setError] = useState('');
    const handleChange = event => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setError('Choose an image file.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be 5 MB or smaller.');
            return;
        }
        setError('');
        const reader = new FileReader();
        reader.onload = () => {
            const preview = new Image();
            preview.onload = () => {
                const scale = Math.min(1, 512 / Math.max(preview.width, preview.height));
                const canvas = document.createElement('canvas');
                canvas.width = Math.max(1, Math.round(preview.width * scale));
                canvas.height = Math.max(1, Math.round(preview.height * scale));
                canvas.getContext('2d').drawImage(preview, 0, 0, canvas.width, canvas.height);
                onChange(canvas.toDataURL('image/jpeg', 0.82));
            };
            preview.onerror = () => setError('Could not read this image.');
            preview.src = reader.result;
        };
        reader.onerror = () => setError('Could not read this image.');
        reader.readAsDataURL(file);
    };
    return /*#__PURE__*/ React.createElement("div", {
        className: "image-upload"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "image-upload__preview"
    }, value ? /*#__PURE__*/ React.createElement("img", {
        src: value,
        alt: "Selected profile",
        className: "image-upload__image"
    }) : /*#__PURE__*/ React.createElement(Icon, {
        n: "student",
        s: 22
    })), /*#__PURE__*/ React.createElement("div", {
        className: "image-upload__controls"
    }, /*#__PURE__*/ React.createElement("label", {
        className: "btn btn-ghost image-upload__button"
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "download",
        s: 15
    }), value ? 'Change photo' : 'Choose photo', /*#__PURE__*/ React.createElement("input", {
        type: "file",
        accept: "image/*",
        onChange: handleChange
    })), /*#__PURE__*/ React.createElement("span", {
        className: "image-upload__hint"
    }, "JPG, PNG or WEBP · up to 5 MB"), error && /*#__PURE__*/ React.createElement("span", {
        className: "image-upload__error",
        role: "alert"
    }, error)), value && /*#__PURE__*/ React.createElement("button", {
        type: "button",
        className: "btn btn-ghost image-upload__remove",
        title: "Remove photo",
        onClick: () => onChange('')
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "trash",
        s: 15
    })));
};

// ─── Mini Donut Chart ──────────────────────────────────────────────────────
const MiniDonut = ({
    value,
    max,
    color = '#4f8ef7',
    size = 56
}) => {
    const r = 20,
        cx = 28,
        cy = 28,
        circ = 2 * Math.PI * r;
    const pct = Math.round(value / max * 100);
    const offset = circ - value / max * circ;
    return /*#__PURE__*/ React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 56 56"
    }, /*#__PURE__*/ React.createElement("circle", {
        cx: cx,
        cy: cy,
        r: r,
        fill: "none",
        stroke: "rgba(255,255,255,0.06)",
        strokeWidth: "6"
    }), /*#__PURE__*/ React.createElement("circle", {
        cx: cx,
        cy: cy,
        r: r,
        fill: "none",
        stroke: color,
        strokeWidth: "6",
        strokeDasharray: circ,
        strokeDashoffset: offset,
        strokeLinecap: "round",
        transform: "rotate(-90 28 28)"
    }), /*#__PURE__*/ React.createElement("text", {
        x: cx,
        y: cy,
        textAnchor: "middle",
        dominantBaseline: "central",
        fill: "#e8edf5",
        fontSize: "11",
        fontWeight: "600",
        fontFamily: "Sora,sans-serif"
    }, pct, "%"));
};

// ─── Bar Sparkline ─────────────────────────────────────────────────────────
const BarSparkline = ({
    data,
    color
}) => {
    const max = Math.max(...data);
    return /*#__PURE__*/ React.createElement("svg", {
        width: "100%",
        height: "40",
        viewBox: `0 0 ${data.length * 18} 40`,
        preserveAspectRatio: "none"
    }, data.map((v, i) => /*#__PURE__*/ React.createElement("rect", {
        key: i,
        x: i * 18 + 2,
        y: 40 - Math.round(v / max * 36),
        width: "14",
        height: Math.round(v / max * 36),
        rx: "3",
        fill: color,
        opacity: i === data.length - 1 ? 1 : 0.5
    })));
};

// ─── Line Sparkline ────────────────────────────────────────────────────────
const LineSparkline = ({
    data,
    color
}) => {
    const max = Math.max(...data),
        min = Math.min(...data),
        range = max - min || 1;
    const w = 120,
        h = 40,
        pts = data.map((v, i) => `${Math.round(i / (data.length - 1) * w)},${Math.round(h - (v - min) / range * (h - 8) - 4)}`).join(' ');
    return /*#__PURE__*/ React.createElement("svg", {
        width: w,
        height: h
    }, /*#__PURE__*/ React.createElement("polyline", {
        points: pts,
        fill: "none",
        stroke: color,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
    }));
};

// ─── Toast ─────────────────────────────────────────────────────────────────
const Toast = ({
    msg,
    type,
    onClose
}) => {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, []);
    const colors = {
        success: 'var(--green)',
        error: 'var(--red)',
        info: 'var(--blue)',
        warning: 'var(--amber)'
    };
    return /*#__PURE__*/ React.createElement("div", {
        style: {
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            background: 'var(--bg2)',
            border: `1px solid ${colors[type] || colors.info}`,
            borderRadius: 10,
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: 'var(--shadow2)',
            animation: 'slideIn .3s ease',
            maxWidth: 320
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: colors[type] || colors.info,
            flexShrink: 0
        }
    }), /*#__PURE__*/ React.createElement("span", {
        style: {
            fontSize: 13,
            color: 'var(--text)'
        }
    }, msg), /*#__PURE__*/ React.createElement("button", {
        onClick: onClose,
        style: {
            background: 'none',
            color: 'var(--text3)',
            marginLeft: 8,
            fontSize: 16,
            lineHeight: 1
        }
    }, "\xD7"));
};

// ─── Modal ─────────────────────────────────────────────────────────────────
const Modal = ({
    title,
    onClose,
    children,
    wide
}) => /*#__PURE__*/ React.createElement("div", {
    className: "modal-overlay",
    onClick: e => e.target === e.currentTarget && onClose()
}, /*#__PURE__*/ React.createElement("div", {
    className: "modal",
    style: {
        maxWidth: wide ? 680 : 520
    }
}, /*#__PURE__*/ React.createElement("div", {
    style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20
    }
}, /*#__PURE__*/ React.createElement("h3", {
    style: {
        fontSize: 16,
        fontWeight: 600,
        color: 'var(--text)'
    }
}, title), /*#__PURE__*/ React.createElement("button", {
    onClick: onClose,
    className: "btn btn-ghost",
    style: {
        padding: '4px 8px'
    }
}, /*#__PURE__*/ React.createElement(Icon, {
    n: "x",
    s: 16
}))), children));

// ─── Form Field ────────────────────────────────────────────────────────────
const Field = ({
    label,
    children,
    half
}) => /*#__PURE__*/ React.createElement("div", {
    style: {
        marginBottom: 14,
        width: half ? 'calc(50% - 6px)' : '100%'
    }
}, /*#__PURE__*/ React.createElement("label", {
    style: {
        display: 'block',
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--text3)',
        textTransform: 'uppercase',
        letterSpacing: .6,
        marginBottom: 5
    }
}, label), children);

// ─── Stat Card ─────────────────────────────────────────────────────────────
const StatCard = ({
    title,
    value,
    sub,
    color,
    icon,
    data,
    trend
}) => /*#__PURE__*/ React.createElement("div", {
    className: "card",
    style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        position: 'relative',
        overflow: 'hidden'
    }
}, /*#__PURE__*/ React.createElement("div", {
    style: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 80,
        opacity: .06,
        background: `linear-gradient(135deg,${color},transparent)`
    }
}), /*#__PURE__*/ React.createElement("div", {
    style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    }
}, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
    style: {
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--text3)',
        textTransform: 'uppercase',
        letterSpacing: .8,
        marginBottom: 6
    }
}, title), /*#__PURE__*/ React.createElement("div", {
    style: {
        fontSize: 28,
        fontWeight: 700,
        color: 'var(--text)',
        lineHeight: 1
    }
}, value), sub && /*#__PURE__*/ React.createElement("div", {
    style: {
        fontSize: 12,
        color: trend === 'up' ? 'var(--green)' : trend === 'down' ? 'var(--red)' : 'var(--text2)',
        marginTop: 4
    }
}, sub)), /*#__PURE__*/ React.createElement("div", {
    style: {
        width: 42,
        height: 42,
        borderRadius: 10,
        background: `${color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color
    }
}, /*#__PURE__*/ React.createElement(Icon, {
    n: icon,
    s: 20
}))), data && /*#__PURE__*/ React.createElement("div", {
    style: {
        height: 40,
        marginTop: 4
    }
}, /*#__PURE__*/ React.createElement(BarSparkline, {
    data: data,
    color: color
})));

// ─── Permission Toggle ─────────────────────────────────────────────────────
const PermToggle = ({
    checked,
    onChange
}) => /*#__PURE__*/ React.createElement("div", {
    onClick: onChange,
    style: {
        width: 36,
        height: 20,
        borderRadius: 10,
        background: checked ? 'var(--blue)' : 'var(--border)',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all .2s',
        flexShrink: 0
    }
}, /*#__PURE__*/ React.createElement("div", {
    style: {
        position: 'absolute',
        top: 2,
        left: checked ? 18 : 2,
        width: 16,
        height: 16,
        borderRadius: '50%',
        background: '#fff',
        transition: 'all .2s'
    }
}));

// ─── Dashboard ─────────────────────────────────────────────────────────────
const Dashboard = ({
    students,
    teachers,
    fees,
    attendance,
    notifications,
    schoolName
}) => {
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === 'active').length;
    const paidFees = fees.filter(f => f.status === 'paid').length;
    const totalRevenue = fees.filter(f => f.status === 'paid').reduce((a, b) => a + b.paid, 0);
    const presentToday = attendance.filter(a => a.status === 'present').length;
    const unreadNotif = notifications.filter(n => !n.read).length;
    return /*#__PURE__*/ React.createElement("div", {
        className: "dashboard-page"
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            marginBottom: 24
        }
    }, /*#__PURE__*/ React.createElement("h1", {
        style: {
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--text)'
        }
    }, "Dashboard"), /*#__PURE__*/ React.createElement("p", {
        style: {
            color: 'var(--text3)',
            fontSize: 13,
            marginTop: 4
        }
    }, "Wednesday, 27 May 2025 \u2014 ", schoolName, " Management System")), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
            gap: 16,
            marginBottom: 24
        }
    }, /*#__PURE__*/ React.createElement(StatCard, {
        title: "Total Students",
        value: totalStudents,
        sub: `${activeStudents} active`,
        color: "var(--blue)",
        icon: "student",
        data: [18, 20, 22, 24, 25, 26, 27, totalStudents],
        trend: "up"
    }), /*#__PURE__*/ React.createElement(StatCard, {
        title: "Teachers",
        value: teachers.length,
        sub: "4 subjects covered",
        color: "var(--purple)",
        icon: "teacher",
        data: [3, 3, 4, 4, 4, 4, 4, teachers.length]
    }), /*#__PURE__*/ React.createElement(StatCard, {
        title: "Attendance Today",
        value: `${presentToday}/${attendance.length}`,
        sub: `${Math.round(presentToday / attendance.length * 100)}% rate`,
        color: "var(--green)",
        icon: "attendance",
        data: [5, 4, 6, 5, 6, 5, 6, presentToday],
        trend: "up"
    }), /*#__PURE__*/ React.createElement(StatCard, {
        title: "Fee Collection",
        value: `₨${(totalRevenue / 1000).toFixed(0)}k`,
        sub: `${paidFees}/${fees.length} paid`,
        color: "var(--amber)",
        icon: "fee",
        data: [20000, 25000, 22000, 30000, 28000, 32000, 35000, totalRevenue],
        trend: "up"
    })), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: 16,
            marginBottom: 16
        }
    }, /*#__PURE__*/ React.createElement("div", {
        className: "card"
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16
        }
    }, /*#__PURE__*/ React.createElement("h3", {
        style: {
            fontWeight: 600,
            fontSize: 15
        }
    }, "Recent Students"), /*#__PURE__*/ React.createElement("span", {
        className: "badge badge-blue"
    }, "Latest 4")), /*#__PURE__*/ React.createElement("table", null, /*#__PURE__*/ React.createElement("thead", null, /*#__PURE__*/ React.createElement("tr", null, /*#__PURE__*/ React.createElement("th", null, "Student"), /*#__PURE__*/ React.createElement("th", null, "Class"), /*#__PURE__*/ React.createElement("th", null, "Fees"), /*#__PURE__*/ React.createElement("th", null, "Status"))), /*#__PURE__*/ React.createElement("tbody", null, students.slice(0, 4).map(s => /*#__PURE__*/ React.createElement("tr", {
        key: s.id
    }, /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            alignItems: 'center',
            gap: 10
        }
    }, /*#__PURE__*/ React.createElement(Avatar, {
        initials: s.photo,
        size: 30,
        color: ['blue', 'green', 'purple', 'amber', 'pink', 'cyan'][s.id % 6],
        image: s.image
    }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--text)'
        }
    }, s.name), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 11,
            color: 'var(--text3)'
        }
    }, s.admNo)))), /*#__PURE__*/ React.createElement("td", null, "Class ", s.class, s.section), /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("span", {
        className: `badge ${s.fees === 'paid' ? 'badge-green' : s.fees === 'partial' ? 'badge-amber' : 'badge-red'}`
    }, s.fees)), /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("span", {
        className: `badge ${s.status === 'active' ? 'badge-green' : 'badge-red'}`
    }, s.status))))))), /*#__PURE__*/ React.createElement("div", {
        className: "card"
    }, /*#__PURE__*/ React.createElement("h3", {
        style: {
            fontWeight: 600,
            fontSize: 15,
            marginBottom: 16
        }
    }, "Fee Overview"), [{
        label: 'Paid',
        val: fees.filter(f => f.status === 'paid').length,
        total: fees.length,
        color: 'var(--green)'
    }, {
        label: 'Unpaid',
        val: fees.filter(f => f.status === 'unpaid').length,
        total: fees.length,
        color: 'var(--red)'
    }, {
        label: 'Partial',
        val: fees.filter(f => f.status === 'partial').length,
        total: fees.length,
        color: 'var(--amber)'
    }].map(item => /*#__PURE__*/ React.createElement("div", {
        key: item.label,
        style: {
            marginBottom: 14
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
            marginBottom: 5
        }
    }, /*#__PURE__*/ React.createElement("span", {
        style: {
            color: 'var(--text2)'
        }
    }, item.label), /*#__PURE__*/ React.createElement("span", {
        style: {
            color: 'var(--text)',
            fontWeight: 600
        }
    }, item.val)), /*#__PURE__*/ React.createElement("div", {
        style: {
            height: 6,
            background: 'var(--border)',
            borderRadius: 3,
            overflow: 'hidden'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            height: '100%',
            width: `${item.val / item.total * 100}%`,
            background: item.color,
            borderRadius: 3,
            transition: 'width .5s'
        }
    })))), /*#__PURE__*/ React.createElement("div", {
        style: {
            marginTop: 20,
            padding: 14,
            background: 'var(--bg3)',
            borderRadius: 8
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 11,
            color: 'var(--text3)',
            marginBottom: 4
        }
    }, "Total Collected (May)"), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--green)'
        }
    }, "\u20A8", totalRevenue.toLocaleString())))), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16
        }
    }, /*#__PURE__*/ React.createElement("div", {
        className: "card"
    }, /*#__PURE__*/ React.createElement("h3", {
        style: {
            fontWeight: 600,
            fontSize: 15,
            marginBottom: 16
        }
    }, "Today's Attendance"), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 12,
            marginBottom: 16
        }
    }, [{
        label: 'Present',
        val: attendance.filter(a => a.status === 'present').length,
        color: 'var(--green)',
        bg: 'var(--greenbg)'
    }, {
        label: 'Absent',
        val: attendance.filter(a => a.status === 'absent').length,
        color: 'var(--red)',
        bg: 'var(--redbg)'
    }, {
        label: 'Late',
        val: attendance.filter(a => a.status === 'late').length,
        color: 'var(--amber)',
        bg: 'var(--amberbg)'
    }].map(item => /*#__PURE__*/ React.createElement("div", {
        key: item.label,
        style: {
            background: item.bg,
            borderRadius: 10,
            padding: '12px',
            textAlign: 'center'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 22,
            fontWeight: 700,
            color: item.color
        }
    }, item.val), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 11,
            color: item.color,
            opacity: .8,
            marginTop: 2
        }
    }, item.label)))), attendance.map(a => /*#__PURE__*/ React.createElement("div", {
        key: a.id,
        style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0',
            borderBottom: '1px solid var(--border)'
        }
    }, /*#__PURE__*/ React.createElement("span", {
        style: {
            fontSize: 13,
            color: 'var(--text2)'
        }
    }, a.studentName), /*#__PURE__*/ React.createElement("span", {
        style: {
            fontSize: 11,
            color: 'var(--text3)'
        }
    }, a.class), /*#__PURE__*/ React.createElement("span", {
        className: `badge ${a.status === 'present' ? 'badge-green' : a.status === 'absent' ? 'badge-red' : 'badge-amber'}`
    }, a.status)))), /*#__PURE__*/ React.createElement("div", {
        className: "card"
    }, /*#__PURE__*/ React.createElement("h3", {
        style: {
            fontWeight: 600,
            fontSize: 15,
            marginBottom: 16
        }
    }, "Notifications ", /*#__PURE__*/ React.createElement("span", {
        className: "badge badge-red",
        style: {
            marginLeft: 6
        }
    }, unreadNotif)), notifications.slice(0, 5).map(n => /*#__PURE__*/ React.createElement("div", {
        key: n.id,
        style: {
            display: 'flex',
            gap: 10,
            padding: '10px 0',
            borderBottom: '1px solid var(--border)',
            opacity: n.read ? .7 : 1
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: n.type === 'warning' ? 'var(--amber)' : n.type === 'danger' ? 'var(--red)' : n.type === 'success' ? 'var(--green)' : 'var(--blue)',
            marginTop: 6,
            flexShrink: 0
        }
    }), /*#__PURE__*/ React.createElement("div", {
        style: {
            flex: 1
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 12,
            color: 'var(--text)',
            lineHeight: 1.4
        }
    }, n.message), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 11,
            color: 'var(--text3)',
            marginTop: 3
        }
    }, n.time)))))));
};

// ─── Students ──────────────────────────────────────────────────────────────
const Students = ({
    students,
    setStudents,
    classes = [],
    toast,
    canEdit,
    canAdd,
    canDelete
}) => {
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({});
    const [viewStudent, setViewStudent] = useState(null);
    const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.admNo.toLowerCase().includes(search.toLowerCase()));
    const openAdd = () => {
        setForm({
            name: '',
            father: '',
            mother: '',
            class: classes[0] ? classes[0].name : '',
            section: classes[0] ? classes[0].section : '',
            dob: '',
            phone: '',
            email: '',
            address: '',
            status: 'active',
            fees: 'unpaid'
        });
        setModal('add');
    };
    const openEdit = s => {
        setForm({
            ...s
        });
        setModal('edit');
    };
    const save = () => {
        if (modal === 'add') {
            const id = Date.now();
            setStudents(p => [...p, {
                ...form,
                id,
                admNo: `SMS-2025-${String(id).slice(-3)}`,
                rollNo: `${form.class}${Math.floor(Math.random() * 100)}`,
                photo: form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
            }]);
            toast('Student added successfully', 'success');
        } else {
            setStudents(p => p.map(s => s.id === form.id ? {
                ...s,
                ...form
            } : s));
            toast('Student updated', 'success');
        }
        setModal(null);
    };
    const del = id => {
        setStudents(p => p.filter(s => s.id !== id));
        toast('Student removed', 'error');
    };
    const classNames = [...new Set(classes.map(item => String(item.name)))];
    const sectionNames = [...new Set(classes.filter(item => String(item.name) === String(form.class)).map(item => String(item.section)))];
    return /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 12
        }
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h1", {
        style: {
            fontSize: 20,
            fontWeight: 700
        }
    }, "Students"), /*#__PURE__*/ React.createElement("p", {
        style: {
            fontSize: 12,
            color: 'var(--text3)',
            marginTop: 2
        }
    }, filtered.length, " students enrolled")), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        className: "student-search",
        style: {
            position: 'relative'
        }
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "search",
        s: 15,
        c: "search-icon",
        style: {
            position: 'absolute'
        }
    }), /*#__PURE__*/ React.createElement("input", {
        className: "student-search__input",
        placeholder: "Search students...",
        value: search,
        onChange: e => setSearch(e.target.value),
        style: {
            paddingLeft: 34,
            width: 220
        }
    })), canAdd && /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-primary",
        onClick: openAdd
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "plus",
        s: 15
    }), "Add Student"))), /*#__PURE__*/ React.createElement("div", {
        className: "card",
        style: {
            padding: 0,
            overflow: 'hidden'
        }
    }, /*#__PURE__*/ React.createElement("table", null, /*#__PURE__*/ React.createElement("thead", null, /*#__PURE__*/ React.createElement("tr", null, /*#__PURE__*/ React.createElement("th", null, "Student"), /*#__PURE__*/ React.createElement("th", null, "Admission #"), /*#__PURE__*/ React.createElement("th", null, "Class"), /*#__PURE__*/ React.createElement("th", null, "Parent"), /*#__PURE__*/ React.createElement("th", null, "Phone"), /*#__PURE__*/ React.createElement("th", null, "Fees"), /*#__PURE__*/ React.createElement("th", null, "Status"), /*#__PURE__*/ React.createElement("th", null, "Actions"))), /*#__PURE__*/ React.createElement("tbody", null, filtered.map(s => {
        const colors = ['blue', 'green', 'purple', 'amber', 'pink', 'cyan'];
        const c = colors[s.id % colors.length];
        return /*#__PURE__*/ React.createElement("tr", {
            key: s.id
        }, /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("div", {
            style: {
                display: 'flex',
                alignItems: 'center',
                gap: 10
            }
        }, /*#__PURE__*/ React.createElement(Avatar, {
            initials: s.photo,
            size: 34,
            color: c,
            image: s.image
        }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
            style: {
                fontWeight: 500,
                color: 'var(--text)'
            }
        }, s.name), /*#__PURE__*/ React.createElement("div", {
            style: {
                fontSize: 11,
                color: 'var(--text3)'
            }
        }, s.email)))), /*#__PURE__*/ React.createElement("td", {
            style: {
                fontFamily: 'var(--mono)',
                fontSize: 12
            }
        }, s.admNo), /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("span", {
            className: "badge badge-blue"
        }, "Class ", s.class, s.section)), /*#__PURE__*/ React.createElement("td", {
            style: {
                color: 'var(--text2)'
            }
        }, s.father), /*#__PURE__*/ React.createElement("td", {
            style: {
                fontSize: 12,
                color: 'var(--text3)'
            }
        }, s.phone), /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("span", {
            className: `badge ${s.fees === 'paid' ? 'badge-green' : s.fees === 'partial' ? 'badge-amber' : 'badge-red'}`
        }, s.fees)), /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("span", {
            className: `badge ${s.status === 'active' ? 'badge-green' : 'badge-red'}`
        }, s.status)), /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("div", {
            style: {
                display: 'flex',
                gap: 6
            }
        }, /*#__PURE__*/ React.createElement("button", {
            className: "btn btn-ghost",
            style: {
                padding: '5px 8px'
            },
            onClick: () => setViewStudent(s)
        }, /*#__PURE__*/ React.createElement(Icon, {
            n: "eye",
            s: 14
        })), canEdit && /*#__PURE__*/ React.createElement("button", {
            className: "btn btn-ghost",
            style: {
                padding: '5px 8px'
            },
            onClick: () => openEdit(s)
        }, /*#__PURE__*/ React.createElement(Icon, {
            n: "edit",
            s: 14
        })), canDelete && /*#__PURE__*/ React.createElement("button", {
            className: "btn btn-danger",
            style: {
                padding: '5px 8px'
            },
            onClick: () => del(s.id)
        }, /*#__PURE__*/ React.createElement(Icon, {
            n: "trash",
            s: 14
        })))));
    })))), (modal === 'add' || modal === 'edit') && /*#__PURE__*/ React.createElement(Modal, {
        title: modal === 'add' ? 'Add New Student' : 'Edit Student',
        onClose: () => setModal(null),
        wide: true
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12
        }
    }, /*#__PURE__*/ React.createElement(Field, {
        label: "Profile Photo"
    }, /*#__PURE__*/ React.createElement(ImageUpload, {
        value: form.image || '',
        onChange: image => setForm({
            ...form,
            image
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Full Name",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        value: form.name || '',
        onChange: e => setForm({
            ...form,
            name: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Father's Name",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        value: form.father || '',
        onChange: e => setForm({
            ...form,
            father: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Mother's Name",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        value: form.mother || '',
        onChange: e => setForm({
            ...form,
            mother: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Date of Birth",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        type: "date",
        value: form.dob || '',
        onChange: e => setForm({
            ...form,
            dob: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Class",
        half: true
    }, /*#__PURE__*/ React.createElement("select", {
        value: form.class || (classNames[0] || ''),
        onChange: e => {
            const nextSections = classes.filter(item => String(item.name) === e.target.value);
            setForm({...form, class: e.target.value, section: nextSections[0] ? String(nextSections[0].section) : '' });
        }
    }, React.createElement("option", { value: '' }, 'Choose class'), classNames.map(c => /*#__PURE__*/ React.createElement("option", {
        key: c,
        value: c
    }, "Class ", c)))), /*#__PURE__*/ React.createElement(Field, {
        label: "Section",
        half: true
    }, /*#__PURE__*/ React.createElement("select", {
        value: form.section || (sectionNames[0] || ''),
        onChange: e => setForm({
            ...form,
            section: e.target.value
        })
    }, React.createElement("option", { value: '' }, 'Choose section'), sectionNames.map(section => /*#__PURE__*/ React.createElement("option", {
        key: section,
        value: section
    }, "Section ", section)))), /*#__PURE__*/ React.createElement(Field, {
        label: "Phone"
    }, /*#__PURE__*/ React.createElement("input", {
        value: form.phone || '',
        onChange: e => setForm({
            ...form,
            phone: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Email"
    }, /*#__PURE__*/ React.createElement("input", {
        type: "email",
        value: form.email || '',
        onChange: e => setForm({
            ...form,
            email: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Address"
    }, /*#__PURE__*/ React.createElement("textarea", {
        rows: 2,
        value: form.address || '',
        onChange: e => setForm({
            ...form,
            address: e.target.value
        }),
        style: {
            resize: 'vertical'
        }
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Status",
        half: true
    }, /*#__PURE__*/ React.createElement("select", {
        value: form.status || 'active',
        onChange: e => setForm({
            ...form,
            status: e.target.value
        })
    }, /*#__PURE__*/ React.createElement("option", {
        value: "active"
    }, "Active"), /*#__PURE__*/ React.createElement("option", {
        value: "inactive"
    }, "Inactive"))), /*#__PURE__*/ React.createElement(Field, {
        label: "Fee Status",
        half: true
    }, /*#__PURE__*/ React.createElement("select", {
        value: form.fees || 'unpaid',
        onChange: e => setForm({
            ...form,
            fees: e.target.value
        })
    }, /*#__PURE__*/ React.createElement("option", {
        value: "paid"
    }, "Paid"), /*#__PURE__*/ React.createElement("option", {
        value: "unpaid"
    }, "Unpaid"), /*#__PURE__*/ React.createElement("option", {
        value: "partial"
    }, "Partial")))), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            marginTop: 20
        }
    }, /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-ghost",
        onClick: () => setModal(null)
    }, "Cancel"), /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-primary",
        onClick: save
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "check",
        s: 15
    }), modal === 'add' ? 'Add Student' : 'Save Changes'))), viewStudent && /*#__PURE__*/ React.createElement(Modal, {
        title: "Student Profile",
        onClose: () => setViewStudent(null),
        wide: true
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            gap: 20,
            marginBottom: 20,
            flexWrap: 'wrap'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            textAlign: 'center'
        }
    }, /*#__PURE__*/ React.createElement(Avatar, {
        initials: viewStudent.photo,
        size: 72,
        color: "blue",
        image: viewStudent.image
    }), /*#__PURE__*/ React.createElement("div", {
        style: {
            marginTop: 10,
            fontWeight: 600,
            fontSize: 16,
            color: 'var(--text)'
        }
    }, viewStudent.name), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 12,
            color: 'var(--text3)',
            fontFamily: 'var(--mono)'
        }
    }, viewStudent.admNo), /*#__PURE__*/ React.createElement("span", {
        className: `badge ${viewStudent.status === 'active' ? 'badge-green' : 'badge-red'}`,
        style: {
            marginTop: 8
        }
    }, viewStudent.status)), /*#__PURE__*/ React.createElement("div", {
        style: {
            flex: 1,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12
        }
    }, [
        ['Class', `Class ${viewStudent.class}${viewStudent.section}`],
        ['Roll No', viewStudent.rollNo],
        ['Father', viewStudent.father],
        ['Mother', viewStudent.mother],
        ['Phone', viewStudent.phone],
        ['Email', viewStudent.email],
        ['DOB', viewStudent.dob],
        ['Fee Status', viewStudent.fees]
    ].map(([k, v]) => /*#__PURE__*/ React.createElement("div", {
        key: k,
        style: {
            background: 'var(--bg3)',
            borderRadius: 8,
            padding: '10px 14px'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--text3)',
            textTransform: 'uppercase',
            letterSpacing: .6,
            marginBottom: 3
        }
    }, k), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 13,
            color: 'var(--text)',
            fontWeight: 500
        }
    }, v))))), /*#__PURE__*/ React.createElement("div", {
        style: {
            background: 'var(--bg3)',
            borderRadius: 8,
            padding: '12px 14px'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--text3)',
            textTransform: 'uppercase',
            letterSpacing: .6,
            marginBottom: 3
        }
    }, "Address"), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 13,
            color: 'var(--text2)'
        }
    }, viewStudent.address))));
};

// ─── Teachers ──────────────────────────────────────────────────────────────
const Teachers = ({
    teachers,
    setTeachers,
    toast,
    canEdit,
    canAdd,
    canDelete
}) => {
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({});
    const openAdd = () => {
        setForm({
            name: '',
            subject: '',
            class: '',
            qualification: '',
            phone: '',
            email: '',
            status: 'active',
            salary: 50000,
            joined: ''
        });
        setModal('add');
    };
    const save = () => {
        if (modal === 'add') {
            setTeachers(p => [...p, {
                ...form,
                id: Date.now(),
                photo: form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
            }]);
            toast('Teacher added', 'success');
        } else {
            setTeachers(p => p.map(t => t.id === form.id ? {
                ...t,
                ...form
            } : t));
            toast('Teacher updated', 'success');
        }
        setModal(null);
    };
    return /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 12
        }
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h1", {
        style: {
            fontSize: 20,
            fontWeight: 700
        }
    }, "Teachers"), /*#__PURE__*/ React.createElement("p", {
        style: {
            fontSize: 12,
            color: 'var(--text3)',
            marginTop: 2
        }
    }, teachers.length, " teaching staff")), canAdd && /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-primary",
        onClick: openAdd
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "plus",
        s: 15
    }), "Add Teacher")), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
            gap: 16
        }
    }, teachers.map((t, i) => {
        const colors = ['purple', 'blue', 'green', 'amber', 'pink', 'cyan'];
        const c = colors[i % colors.length];
        return /*#__PURE__*/ React.createElement("div", {
            key: t.id,
            className: "card",
            style: {
                display: 'flex',
                flexDirection: 'column',
                gap: 12
            }
        }, /*#__PURE__*/ React.createElement("div", {
            style: {
                display: 'flex',
                alignItems: 'center',
                gap: 12
            }
        }, /*#__PURE__*/ React.createElement(Avatar, {
            initials: t.photo,
            size: 48,
            color: c,
            image: t.image
        }), /*#__PURE__*/ React.createElement("div", {
            style: {
                flex: 1
            }
        }, /*#__PURE__*/ React.createElement("div", {
            style: {
                fontWeight: 600,
                fontSize: 15,
                color: 'var(--text)'
            }
        }, t.name), /*#__PURE__*/ React.createElement("div", {
            style: {
                fontSize: 12,
                color: 'var(--text3)'
            }
        }, t.subject)), /*#__PURE__*/ React.createElement("span", {
            className: `badge ${t.status === 'active' ? 'badge-green' : 'badge-red'}`
        }, t.status)), /*#__PURE__*/ React.createElement("div", {
            style: {
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8
            }
        }, [
            ['Classes', t.class],
            ['Qualification', t.qualification],
            ['Phone', t.phone],
            ['Joined', t.joined]
        ].map(([k, v]) => /*#__PURE__*/ React.createElement("div", {
            key: k,
            style: {
                background: 'var(--bg3)',
                borderRadius: 6,
                padding: '8px 10px'
            }
        }, /*#__PURE__*/ React.createElement("div", {
            style: {
                fontSize: 10,
                color: 'var(--text3)',
                textTransform: 'uppercase',
                letterSpacing: .4,
                marginBottom: 2
            }
        }, k), /*#__PURE__*/ React.createElement("div", {
            style: {
                fontSize: 12,
                color: 'var(--text)',
                fontWeight: 500
            }
        }, v)))), /*#__PURE__*/ React.createElement("div", {
            style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid var(--border)',
                paddingTop: 12
            }
        }, /*#__PURE__*/ React.createElement("div", {
            style: {
                fontSize: 13,
                color: 'var(--green)',
                fontWeight: 600
            }
        }, "\u20A8", t.salary ? t.salary.toLocaleString() : '', "/mo"), /*#__PURE__*/ React.createElement("div", {
            style: {
                display: 'flex',
                gap: 6
            }
        }, canEdit && /*#__PURE__*/ React.createElement("button", {
            className: "btn btn-ghost",
            style: {
                padding: '5px 8px'
            },
            onClick: () => {
                setForm({
                    ...t
                });
                setModal('edit');
            }
        }, /*#__PURE__*/ React.createElement(Icon, {
            n: "edit",
            s: 14
        })), canDelete && /*#__PURE__*/ React.createElement("button", {
            className: "btn btn-danger",
            style: {
                padding: '5px 8px'
            },
            onClick: () => {
                setTeachers(p => p.filter(x => x.id !== t.id));
                toast('Teacher removed', 'error');
            }
        }, /*#__PURE__*/ React.createElement(Icon, {
            n: "trash",
            s: 14
        })))));
    })), (modal === 'add' || modal === 'edit') && /*#__PURE__*/ React.createElement(Modal, {
        title: modal === 'add' ? 'Add Teacher' : 'Edit Teacher',
        onClose: () => setModal(null),
        wide: true
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12
        }
    }, /*#__PURE__*/ React.createElement(Field, {
        label: "Profile Photo"
    }, /*#__PURE__*/ React.createElement(ImageUpload, {
        value: form.image || '',
        onChange: image => setForm({
            ...form,
            image
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Full Name",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        value: form.name || '',
        onChange: e => setForm({
            ...form,
            name: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Subject",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        value: form.subject || '',
        onChange: e => setForm({
            ...form,
            subject: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Classes",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        placeholder: "e.g. 9,10",
        value: form.class || '',
        onChange: e => setForm({
            ...form,
            class: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Qualification",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        value: form.qualification || '',
        onChange: e => setForm({
            ...form,
            qualification: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Phone",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        value: form.phone || '',
        onChange: e => setForm({
            ...form,
            phone: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Email",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        value: form.email || '',
        onChange: e => setForm({
            ...form,
            email: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Salary (\u20A8)",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        type: "number",
        value: form.salary || '',
        onChange: e => setForm({
            ...form,
            salary: +e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Joining Date",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        type: "date",
        value: form.joined || '',
        onChange: e => setForm({
            ...form,
            joined: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Status"
    }, /*#__PURE__*/ React.createElement("select", {
        value: form.status || 'active',
        onChange: e => setForm({
            ...form,
            status: e.target.value
        })
    }, /*#__PURE__*/ React.createElement("option", {
        value: "active"
    }, "Active"), /*#__PURE__*/ React.createElement("option", {
        value: "inactive"
    }, "Inactive")))), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            marginTop: 20
        }
    }, /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-ghost",
        onClick: () => setModal(null)
    }, "Cancel"), /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-primary",
        onClick: save
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "check",
        s: 15
    }), modal === 'add' ? 'Add Teacher' : 'Save'))));
};

const Classes = ({ classes, setClasses, timetable, setTimetable, teachers, toast }) => {
    const [classForm, setClassForm] = useState({ name: '', section: '', teacherId: '' });
    const [lessonForm, setLessonForm] = useState({ classId: '', day: 'Monday', subject: '', teacherId: '', startTime: '08:00', endTime: '08:40' });
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const createClass = () => {
        const name = classForm.name.trim();
        const section = classForm.section.trim();
        if (!name || !section) return toast('Enter a class and section.', 'error');
        if (classes.some(item => item.name.toLowerCase() === name.toLowerCase() && item.section.toLowerCase() === section.toLowerCase())) {
            return toast('That class and section already exists.', 'error');
        }
        setClasses(previous => [...previous, { id: Date.now(), name, section, teacherId: classForm.teacherId ? Number(classForm.teacherId) : '' }]);
        setClassForm({ name: '', section: '', teacherId: '' });
        toast('Class section created.', 'success');
    };
    const createLesson = () => {
        const selectedClass = classes.find(item => String(item.id) === String(lessonForm.classId));
        if (!selectedClass || !lessonForm.subject.trim() || !lessonForm.teacherId || !lessonForm.startTime || !lessonForm.endTime) {
            return toast('Complete all timetable fields.', 'error');
        }
        if (lessonForm.startTime >= lessonForm.endTime) return toast('End time must be after start time.', 'error');
        const collision = timetable.some(item => String(item.classId) === String(selectedClass.id) && item.day === lessonForm.day && item.startTime < lessonForm.endTime && lessonForm.startTime < item.endTime);
        if (collision) return toast('This class already has a lesson at that time.', 'error');
        setTimetable(previous => [...previous, {
            ...lessonForm,
            id: Date.now(),
            classId: selectedClass.id,
            className: selectedClass.name,
            section: selectedClass.section,
            subject: lessonForm.subject.trim(),
            teacherId: Number(lessonForm.teacherId)
        }]);
        setLessonForm(previous => ({...previous, subject: '' }));
        toast('Timetable lesson added.', 'success');
    };
    const classOptions = classes.map(item => React.createElement('option', { key: item.id, value: item.id }, `Class ${item.name} - ${item.section}`));
    const teacherOptions = teachers.filter(teacher => teacher.status !== 'inactive').map(teacher => React.createElement('option', { key: teacher.id, value: teacher.id }, teacher.name));
    return React.createElement('div', null,
        React.createElement('div', { style: { marginBottom: 20 } },
            React.createElement('h1', { style: { fontSize: 20, fontWeight: 700 } }, 'Classes & Timetable'),
            React.createElement('p', { style: { fontSize: 12, color: 'var(--text3)', marginTop: 2 } }, 'Create sections, assign class teachers, and plan weekly lessons.')),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'minmax(260px, 1fr) minmax(280px, 1.4fr)', gap: 16, marginBottom: 20 } },
            React.createElement('section', { className: 'card' },
                React.createElement('h2', { style: { fontSize: 15, marginBottom: 14 } }, 'Add a class section'),
                React.createElement(Field, { label: 'Class / Grade' }, React.createElement('input', { value: classForm.name, placeholder: 'e.g. 7 or Grade 7', onChange: event => setClassForm({...classForm, name: event.target.value }) })),
                React.createElement(Field, { label: 'Section' }, React.createElement('input', { value: classForm.section, placeholder: 'e.g. A', onChange: event => setClassForm({...classForm, section: event.target.value }) })),
                React.createElement(Field, { label: 'Class teacher' }, React.createElement('select', { value: classForm.teacherId, onChange: event => setClassForm({...classForm, teacherId: event.target.value }) }, React.createElement('option', { value: '' }, 'Choose teacher'), teacherOptions)),
                React.createElement('button', { className: 'btn btn-primary', onClick: createClass }, React.createElement(Icon, { n: 'plus', s: 15 }), 'Create section')),
            React.createElement('section', { className: 'card' },
                React.createElement('h2', { style: { fontSize: 15, marginBottom: 14 } }, 'Add timetable lesson'),
                React.createElement(Field, { label: 'Class and section' }, React.createElement('select', { value: lessonForm.classId, onChange: event => setLessonForm({...lessonForm, classId: event.target.value }) }, React.createElement('option', { value: '' }, 'Choose class'), classOptions)),
                React.createElement(Field, { label: 'Day' }, React.createElement('select', { value: lessonForm.day, onChange: event => setLessonForm({...lessonForm, day: event.target.value }) }, days.map(day => React.createElement('option', { key: day, value: day }, day)))),
                React.createElement(Field, { label: 'Subject' }, React.createElement('input', { value: lessonForm.subject, placeholder: 'Subject name', onChange: event => setLessonForm({...lessonForm, subject: event.target.value }) })),
                React.createElement(Field, { label: 'Teacher' }, React.createElement('select', { value: lessonForm.teacherId, onChange: event => setLessonForm({...lessonForm, teacherId: event.target.value }) }, React.createElement('option', { value: '' }, 'Choose teacher'), teacherOptions)),
                React.createElement('div', { style: { display: 'flex', gap: 12 } },
                    React.createElement(Field, { label: 'Start', half: true }, React.createElement('input', { type: 'time', value: lessonForm.startTime, onChange: event => setLessonForm({...lessonForm, startTime: event.target.value }) })),
                    React.createElement(Field, { label: 'End', half: true }, React.createElement('input', { type: 'time', value: lessonForm.endTime, onChange: event => setLessonForm({...lessonForm, endTime: event.target.value }) }))),
                React.createElement('button', { className: 'btn btn-primary', onClick: createLesson, disabled: classes.length === 0 || teachers.length === 0 }, React.createElement(Icon, { n: 'plus', s: 15 }), 'Add lesson'))),
        React.createElement('section', { className: 'card', style: { padding: 0, overflow: 'hidden', marginBottom: 20 } },
            React.createElement('h2', { style: { padding: '16px 18px', fontSize: 15 } }, `Classes and sections · ${classes.length}`),
            React.createElement('table', null,
                React.createElement('thead', null, React.createElement('tr', null, React.createElement('th', null, 'Class'), React.createElement('th', null, 'Section'), React.createElement('th', null, 'Students'), React.createElement('th', null, 'Class teacher'))),
                React.createElement('tbody', null, classes.map(item => React.createElement('tr', { key: item.id },
                    React.createElement('td', null, item.name),
                    React.createElement('td', null, item.section),
                    React.createElement('td', null, item.studentCount || 0),
                    React.createElement('td', null, React.createElement('select', {
                        'aria-label': `Class teacher for ${item.name} ${item.section}`,
                        value: item.teacherId || '',
                        onChange: event => setClasses(previous => previous.map(entry => entry.id === item.id ? {...entry, teacherId: event.target.value ? Number(event.target.value) : '' } : entry))
                    }, React.createElement('option', { value: '' }, 'Unassigned'), teacherOptions))))),
                classes.length === 0 && React.createElement('p', { style: { padding: 18, color: 'var(--text3)' } }, 'Create a class and section to start assigning students and planning lessons.')),
            React.createElement('section', { className: 'card', style: { padding: 0, overflow: 'hidden' } },
                React.createElement('h2', { style: { padding: '16px 18px', fontSize: 15 } }, `Weekly timetable · ${timetable.length} lessons`),
                React.createElement('table', null,
                    React.createElement('thead', null, React.createElement('tr', null, React.createElement('th', null, 'Day'), React.createElement('th', null, 'Time'), React.createElement('th', null, 'Class'), React.createElement('th', null, 'Subject'), React.createElement('th', null, 'Teacher'), React.createElement('th', null, ''))),
                    React.createElement('tbody', null, timetable.slice().sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day) || a.startTime.localeCompare(b.startTime)).map(item => React.createElement('tr', { key: item.id },
                        React.createElement('td', null, item.day), React.createElement('td', null, `${item.startTime}–${item.endTime}`), React.createElement('td', null, `${item.className} ${item.section}`), React.createElement('td', null, item.subject),
                        React.createElement('td', null, (teachers.find(teacher => teacher.id === item.teacherId) || {}).name || 'Unassigned'),
                        React.createElement('td', null, React.createElement('button', { className: 'btn btn-danger', title: 'Remove lesson', onClick: () => setTimetable(previous => previous.filter(lesson => lesson.id !== item.id)) }, React.createElement(Icon, { n: 'trash', s: 14 }))))))),
                timetable.length === 0 && React.createElement('p', { style: { padding: 18, color: 'var(--text3)' } }, 'No timetable lessons added.'))));
};

// ─── Attendance ────────────────────────────────────────────────────────────
const Attendance = ({
    attendance,
    setAttendance,
    students,
    classes = [],
    toast,
    canEdit
}) => {
    const [date, setDate] = useState(localDateString);
    const [classFilter, setClassFilter] = useState('all');
    const classGroups = classes.length ? classes.map(item => ({ key: `${item.name}::${item.section}`, name: item.name, section: item.section, code: `${item.name}${item.section}` })) : [...new Map(students.map(student => [`${student.class}::${student.section}`, { key: `${student.class}::${student.section}`, name: student.class, section: student.section, code: `${student.class}${student.section}` }])).values()];
    const selectedGroup = classGroups.find(group => group.key === classFilter);
    const dateRecords = attendance.filter(record => record.date === date);
    const roster = classFilter === 'all' || !selectedGroup ? [] : students.filter(student => student.status !== 'inactive' && String(student.class) === String(selectedGroup.name) && String(student.section) === String(selectedGroup.section));
    const filtered = classFilter === 'all' ? dateRecords : roster.map(student => dateRecords.find(record => record.studentId === student.id) || {
        id: student.id,
        studentId: student.id,
        studentName: student.name,
        class: `${student.class}${student.section}`,
        date,
        status: 'unmarked'
    });
    const setStudentStatus = (studentId, status) => {
        if (!canEdit) return;
        const student = students.find(item => item.id === studentId);
        if (!student) return;
        const existing = attendance.find(record => record.studentId === studentId && record.date === date);
        const record = {
            id: existing ? existing.id : Date.now() + Number(studentId),
            studentId,
            studentName: student.name,
            class: `${student.class}${student.section}`,
            date,
            status
        };
        setAttendance(previous => existing ? previous.map(item => item.id === existing.id ? {...item, ...record } : item) : [...previous, record]);
    };
    const toggle = (studentId, status) => {
        const cycle = {
            unmarked: 'present',
            present: 'absent',
            absent: 'late',
            late: 'present'
        };
        setStudentStatus(studentId, cycle[status] || 'present');
        toast('Attendance updated', 'info');
    };
    const markAll = status => {
        const selectedStudents = classFilter === 'all' ? students.filter(student => student.status !== 'inactive') : roster;
        selectedStudents.forEach(student => setStudentStatus(student.id, status));
        toast(`Marked all as ${status}`, 'success');
    };
    return /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 12
        }
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h1", {
        style: {
            fontSize: 20,
            fontWeight: 700
        }
    }, "Attendance"), /*#__PURE__*/ React.createElement("p", {
        style: {
            fontSize: 12,
            color: 'var(--text3)',
            marginTop: 2
        }
    }, "Daily attendance tracking")), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap'
        }
    }, /*#__PURE__*/ React.createElement("input", {
        type: "date",
        value: date,
        onChange: e => setDate(e.target.value),
        style: {
            width: 160
        }
    }), /*#__PURE__*/ React.createElement("select", {
        value: classFilter,
        onChange: e => setClassFilter(e.target.value),
        style: {
            width: 120
        }
    }, /*#__PURE__*/ React.createElement("option", {
        value: "all"
    }, "All Classes"), classGroups.map(group => React.createElement("option", {
        key: group.key,
        value: group.key
    }, `Class ${group.name} - ${group.section}`))), canEdit && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-success",
        onClick: () => markAll('present'),
        style: {
            fontSize: 12,
            padding: '8px 12px'
        }
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "check",
        s: 13
    }), "All Present"), /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-danger",
        onClick: () => markAll('absent'),
        style: {
            fontSize: 12,
            padding: '8px 12px'
        }
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "x",
        s: 13
    }), "All Absent")))), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
            gap: 12,
            marginBottom: 20
        }
    }, [{
        l: 'Present',
        v: filtered.filter(a => a.status === 'present').length,
        c: 'var(--green)',
        bg: 'var(--greenbg)'
    }, {
        l: 'Absent',
        v: filtered.filter(a => a.status === 'absent').length,
        c: 'var(--red)',
        bg: 'var(--redbg)'
    }, {
        l: 'Late',
        v: filtered.filter(a => a.status === 'late').length,
        c: 'var(--amber)',
        bg: 'var(--amberbg)'
    }, {
        l: 'Total',
        v: filtered.length,
        c: 'var(--blue)',
        bg: 'var(--bluebg)'
    }].map(item => /*#__PURE__*/ React.createElement("div", {
        key: item.l,
        style: {
            background: item.bg,
            borderRadius: 12,
            padding: 16,
            textAlign: 'center'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 28,
            fontWeight: 700,
            color: item.c
        }
    }, item.v), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 12,
            color: item.c,
            opacity: .8,
            marginTop: 2
        }
    }, item.l)))), /*#__PURE__*/ React.createElement("div", {
        className: "card",
        style: {
            padding: 0,
            overflow: 'hidden'
        }
    }, /*#__PURE__*/ React.createElement("table", null, /*#__PURE__*/ React.createElement("thead", null, /*#__PURE__*/ React.createElement("tr", null, /*#__PURE__*/ React.createElement("th", null, "Student"), /*#__PURE__*/ React.createElement("th", null, "Class"), /*#__PURE__*/ React.createElement("th", null, "Date"), /*#__PURE__*/ React.createElement("th", null, "Status"), canEdit && /*#__PURE__*/ React.createElement("th", null, "Action"))), /*#__PURE__*/ React.createElement("tbody", null, filtered.map(a => /*#__PURE__*/ React.createElement("tr", {
        key: a.id
    }, /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            alignItems: 'center',
            gap: 8
        }
    }, /*#__PURE__*/ React.createElement(Avatar, {
        initials: a.studentName.split(' ').map(w => w[0]).join(''),
        size: 28,
        color: a.status === 'present' ? 'green' : a.status === 'absent' ? 'red' : 'amber'
    }), /*#__PURE__*/ React.createElement("span", {
        style: {
            fontWeight: 500,
            color: 'var(--text)'
        }
    }, a.studentName))), /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("span", {
        className: "badge badge-blue"
    }, a.class)), /*#__PURE__*/ React.createElement("td", {
        style: {
            fontSize: 12,
            fontFamily: 'var(--mono)',
            color: 'var(--text3)'
        }
    }, a.date), /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("span", {
        className: `badge ${a.status === 'present' ? 'badge-green' : a.status === 'absent' ? 'badge-red' : 'badge-amber'}`
    }, a.status)), canEdit && /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-ghost",
        style: {
            fontSize: 11,
            padding: '4px 10px'
        },
        onClick: () => toggle(a.studentId, a.status)
    }, "Toggle"))))))));
};

// ─── Fees ──────────────────────────────────────────────────────────────────
const Fees = ({
    fees,
    setFees,
    toast,
    canEdit,
    canAdd
}) => {
    const [filter, setFilter] = useState('all');
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({});
    const filtered = fees.filter(f => filter === 'all' || f.status === filter);
    const totalCollected = fees.filter(f => f.status === 'paid').reduce((a, b) => a + b.paid, 0);
    const totalPending = fees.filter(f => f.status !== 'paid').reduce((a, b) => a + b.balance, 0);
    const markPaid = id => {
        setFees(p => p.map(f => f.id === id ? {
            ...f,
            status: 'paid',
            paid: f.amount,
            balance: 0,
            paidDate: new Date().toISOString().split('T')[0],
            receipt: `RCP-${Math.floor(Math.random() * 9000) + 1000}`
        } : f));
        toast('Fee marked as paid', 'success');
    };
    return /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 12
        }
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h1", {
        style: {
            fontSize: 20,
            fontWeight: 700
        }
    }, "Fee Management"), /*#__PURE__*/ React.createElement("p", {
        style: {
            fontSize: 12,
            color: 'var(--text3)',
            marginTop: 2
        }
    }, "Track and manage student fees")), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap'
        }
    }, ['all', 'paid', 'unpaid', 'partial'].map(f => /*#__PURE__*/ React.createElement("button", {
        key: f,
        className: `btn ${filter === f ? 'btn-primary' : 'btn-ghost'}`,
        style: {
            fontSize: 12,
            padding: '7px 14px'
        },
        onClick: () => setFilter(f)
    }, f.charAt(0).toUpperCase() + f.slice(1))))), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
            gap: 14,
            marginBottom: 20
        }
    }, /*#__PURE__*/ React.createElement("div", {
        className: "card",
        style: {
            background: 'var(--greenbg)',
            border: '1px solid rgba(52,211,153,.2)'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 11,
            color: 'var(--green)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: .6,
            marginBottom: 6
        }
    }, "Total Collected"), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--green)'
        }
    }, "\u20A8", totalCollected.toLocaleString())), /*#__PURE__*/ React.createElement("div", {
        className: "card",
        style: {
            background: 'var(--redbg)',
            border: '1px solid rgba(248,113,113,.2)'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 11,
            color: 'var(--red)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: .6,
            marginBottom: 6
        }
    }, "Outstanding"), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--red)'
        }
    }, "\u20A8", totalPending.toLocaleString())), /*#__PURE__*/ React.createElement("div", {
        className: "card"
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 11,
            color: 'var(--text3)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: .6,
            marginBottom: 6
        }
    }, "Paid Students"), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--text)'
        }
    }, fees.filter(f => f.status === 'paid').length, /*#__PURE__*/ React.createElement("span", {
        style: {
            fontSize: 14,
            color: 'var(--text3)'
        }
    }, " / ", fees.length))), /*#__PURE__*/ React.createElement("div", {
        className: "card"
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 11,
            color: 'var(--text3)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: .6,
            marginBottom: 6
        }
    }, "Collection Rate"), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--blue)'
        }
    }, Math.round(fees.filter(f => f.status === 'paid').length / fees.length * 100), "%"))), /*#__PURE__*/ React.createElement("div", {
        className: "card",
        style: {
            padding: 0,
            overflow: 'hidden'
        }
    }, /*#__PURE__*/ React.createElement("table", null, /*#__PURE__*/ React.createElement("thead", null, /*#__PURE__*/ React.createElement("tr", null, /*#__PURE__*/ React.createElement("th", null, "Student"), /*#__PURE__*/ React.createElement("th", null, "Month"), /*#__PURE__*/ React.createElement("th", null, "Amount"), /*#__PURE__*/ React.createElement("th", null, "Paid"), /*#__PURE__*/ React.createElement("th", null, "Balance"), /*#__PURE__*/ React.createElement("th", null, "Due Date"), /*#__PURE__*/ React.createElement("th", null, "Status"), /*#__PURE__*/ React.createElement("th", null, "Receipt"), canEdit && /*#__PURE__*/ React.createElement("th", null, "Actions"))), /*#__PURE__*/ React.createElement("tbody", null, filtered.map(f => /*#__PURE__*/ React.createElement("tr", {
        key: f.id
    }, /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontWeight: 500,
            color: 'var(--text)'
        }
    }, f.studentName), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 11,
            color: 'var(--text3)'
        }
    }, f.class)), /*#__PURE__*/ React.createElement("td", {
        style: {
            fontSize: 12,
            color: 'var(--text2)'
        }
    }, f.month), /*#__PURE__*/ React.createElement("td", {
        style: {
            fontWeight: 600,
            color: 'var(--text)'
        }
    }, "\u20A8", f.amount.toLocaleString()), /*#__PURE__*/ React.createElement("td", {
        style: {
            color: 'var(--green)'
        }
    }, "\u20A8", f.paid.toLocaleString()), /*#__PURE__*/ React.createElement("td", {
        style: {
            color: f.balance > 0 ? 'var(--red)' : 'var(--text3)'
        }
    }, "\u20A8", f.balance.toLocaleString()), /*#__PURE__*/ React.createElement("td", {
        style: {
            fontSize: 12,
            color: 'var(--text3)',
            fontFamily: 'var(--mono)'
        }
    }, f.dueDate), /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("span", {
        className: `badge ${f.status === 'paid' ? 'badge-green' : f.status === 'partial' ? 'badge-amber' : 'badge-red'}`
    }, f.status)), /*#__PURE__*/ React.createElement("td", {
        style: {
            fontSize: 11,
            fontFamily: 'var(--mono)',
            color: 'var(--text3)'
        }
    }, f.receipt || '—'), canEdit && /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            gap: 6
        }
    }, f.status !== 'paid' && /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-success",
        style: {
            padding: '4px 10px',
            fontSize: 11
        },
        onClick: () => markPaid(f.id)
    }, "Mark Paid"), f.receipt && /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-ghost",
        style: {
            padding: '4px 8px'
        },
        title: "Print Receipt"
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "print",
        s: 13
    }))))))))));
};

const FeesDesk = ({ fees, setFees, payments, setPayments, students, setStudents, classes = [], toast, canEdit, canAdd }) => {
        const h = React.createElement;
        const [filter, setFilter] = useState('all');
        const [voucherOpen, setVoucherOpen] = useState(false);
        const [paymentFee, setPaymentFee] = useState(null);
        const [voucherForm, setVoucherForm] = useState({ classKey: '', studentId: '', month: new Date().toLocaleString('en', { month: 'long', year: 'numeric' }), amount: '', dueDate: '' });
        const [paymentForm, setPaymentForm] = useState({ amount: '', method: 'Cash', account: 'Cash account' });
        const filteredFees = fees.filter(fee => filter === 'all' || fee.status === filter);
        const selectedClass = classes.find(item => `${item.name}::${item.section}` === voucherForm.classKey);
        const voucherStudents = selectedClass ? students.filter(student => student.status !== 'inactive' && String(student.class) === String(selectedClass.name) && String(student.section) === String(selectedClass.section)) : [];
        const cashTotal = payments.filter(payment => payment.account === 'Cash account').reduce((total, payment) => total + Number(payment.amount), 0);
        const otherTotal = payments.filter(payment => payment.account !== 'Cash account').reduce((total, payment) => total + Number(payment.amount), 0);
        const money = amount => `₨${Number(amount || 0).toLocaleString()}`;
        const printSlip = (heading, rows) => {
                const popup = window.open('', '_blank', 'width=720,height=720');
                if (!popup) return toast('Allow pop-ups to print this voucher.', 'error');
                const escape = value => String(value == null ? '' : value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
                popup.document.write(`<!doctype html><html><head><title>${escape(heading)}</title><style>body{font:15px Arial,sans-serif;max-width:640px;margin:36px auto;color:#17201b}h1{font-size:24px;border-bottom:2px solid #16865c;padding-bottom:12px}table{width:100%;border-collapse:collapse;margin-top:22px}td{padding:10px;border-bottom:1px solid #d7ded9}td:first-child{color:#57665d;width:40%}.total{font-size:19px;font-weight:bold}@media print{button{display:none}}</style></head><body><h1>${escape(heading)}</h1><table>${rows.map(([label, value]) => `<tr><td>${escape(label)}</td><td>${escape(value)}</td></tr>`).join('')}</table><p>School fee record</p><script>window.onload=()=>window.print()</script></body></html>`);
        popup.document.close();
    };
    const createVoucher = () => {
        const student = students.find(item => String(item.id) === String(voucherForm.studentId));
        const amount = Number(voucherForm.amount);
        if (!selectedClass || !student || amount <= 0 || !voucherForm.month || !voucherForm.dueDate) return toast('Choose a class, student, fee period, amount, and due date.', 'error');
        const id = Date.now();
        const voucher = { id, studentId: student.id, studentName: student.name, class: `${student.class || ''}${student.section || ''}`, month: voucherForm.month, amount, paid: 0, balance: amount, status: 'unpaid', dueDate: voucherForm.dueDate, paidDate: null, receipt: `FV-${id}` };
        setFees(previous => [...previous, voucher]);
        setVoucherOpen(false);
        setVoucherForm({ classKey: '', studentId: '', month: new Date().toLocaleString('en', { month: 'long', year: 'numeric' }), amount: '', dueDate: '' });
        toast('Fee voucher created.', 'success');
        printSlip('Fee Voucher', [['Voucher number', voucher.receipt], ['Student', voucher.studentName], ['Class / Section', voucher.class], ['Fee period', voucher.month], ['Amount due', money(voucher.amount)], ['Due date', voucher.dueDate]]);
    };
    const collectPayment = () => {
        const fee = fees.find(item => item.id === paymentFee);
        const amount = Number(paymentForm.amount);
        if (!fee || amount <= 0 || amount > fee.balance) return toast('Enter a payment greater than zero and no more than the remaining balance.', 'error');
        const date = localDateString();
        const payment = { id: Date.now(), feeId: fee.id, voucher: fee.receipt, studentId: fee.studentId, studentName: fee.studentName, amount, method: paymentForm.method, account: paymentForm.account, date, receipt: `RC-${Date.now()}` };
        setPayments(previous => [...previous, payment]);
        setFees(previous => previous.map(item => {
            if (item.id !== fee.id) return item;
            const paid = Number(item.paid || 0) + amount;
            const balance = Math.max(0, Number(item.amount) - paid);
            return { ...item, paid, balance, status: balance === 0 ? 'paid' : 'partial', paidDate: date };
        }));
        setStudents(previous => previous.map(student => {
            if (student.id !== fee.studentId) return student;
            const otherBalance = fees.filter(item => item.studentId === fee.studentId && item.id !== fee.id).reduce((total, item) => total + Number(item.balance || 0), 0);
            const remainingBalance = Math.max(0, Number(fee.balance) - amount) + otherBalance;
            return { ...student, fees: remainingBalance === 0 ? 'paid' : 'partial' };
        }));
        setPaymentFee(null);
        setPaymentForm({ amount: '', method: 'Cash', account: 'Cash account' });
        toast('Payment recorded.', 'success');
        printSlip('Fee Payment Receipt', [['Receipt number', payment.receipt], ['Voucher number', payment.voucher], ['Student', payment.studentName], ['Amount received', money(payment.amount)], ['Payment method', payment.method], ['Account', payment.account], ['Date', payment.date]]);
    };
    const voucherRows = filteredFees.map(fee => h('tr', { key: fee.id },
        h('td', null, h('strong', null, fee.studentName), h('div', { style: { fontSize: 11, color: 'var(--text3)' } }, fee.class || '')),
        h('td', null, fee.receipt || '—'), h('td', null, fee.month), h('td', null, money(fee.amount)), h('td', null, money(fee.paid)), h('td', null, money(fee.balance)),
        h('td', null, h('span', { className: `badge ${fee.status === 'paid' ? 'badge-green' : fee.status === 'partial' ? 'badge-amber' : 'badge-red'}` }, fee.status)),
        h('td', null, h('div', { style: { display: 'flex', gap: 6 } },
            canEdit && fee.balance > 0 && h('button', { className: 'btn btn-success', onClick: () => { setPaymentFee(fee.id); setPaymentForm({ amount: String(fee.balance), method: 'Cash', account: 'Cash account' }); } }, 'Collect'),
            h('button', { className: 'btn btn-ghost', title: 'Print fee voucher', onClick: () => printSlip('Fee Voucher', [['Voucher number', fee.receipt], ['Student', fee.studentName], ['Class / Section', fee.class], ['Fee period', fee.month], ['Amount due', money(fee.amount)], ['Amount paid', money(fee.paid)], ['Balance', money(fee.balance)], ['Due date', fee.dueDate]]) }, h(Icon, { n: 'print', s: 14 }))))));
    const paymentRows = payments.slice().sort((a, b) => b.id - a.id).map(payment => {
        const printPayment = () => printSlip('Fee Payment Receipt', [
            ['Receipt number', payment.receipt], ['Voucher number', payment.voucher], ['Student', payment.studentName],
            ['Amount received', money(payment.amount)], ['Payment method', payment.method], ['Account', payment.account], ['Date', payment.date]
        ]);
        return h('tr', { key: payment.id },
            h('td', null, payment.date), h('td', null, payment.receipt), h('td', null, payment.studentName), h('td', null, payment.voucher),
            h('td', null, payment.method), h('td', null, payment.account), h('td', null, money(payment.amount)),
            h('td', null, h('button', { className: 'btn btn-ghost', title: 'Print payment receipt', onClick: printPayment }, h(Icon, { n: 'print', s: 14 }))));
    });
    return h('div', null,
        h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 18 } }, h('div', null, h('h1', { style: { fontSize: 20, fontWeight: 700 } }, 'Fee Management'), h('p', { style: { color: 'var(--text3)', fontSize: 12 } }, 'Create vouchers, record payments, and issue receipts.')), canAdd && h('button', { className: 'btn btn-primary', onClick: () => setVoucherOpen(true) }, h(Icon, { n: 'plus', s: 15 }), 'Create fee voucher')),
        h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, marginBottom: 18 } },
            h('div', { className: 'card' }, h('div', { style: { color: 'var(--text3)', fontSize: 11 } }, 'Cash account received'), h('strong', { style: { color: 'var(--green)', fontSize: 22 } }, money(cashTotal))),
            h('div', { className: 'card' }, h('div', { style: { color: 'var(--text3)', fontSize: 11 } }, 'Other accounts received'), h('strong', { style: { color: 'var(--blue)', fontSize: 22 } }, money(otherTotal))),
            h('div', { className: 'card' }, h('div', { style: { color: 'var(--text3)', fontSize: 11 } }, 'Outstanding fees'), h('strong', { style: { color: 'var(--red)', fontSize: 22 } }, money(fees.reduce((sum, fee) => sum + Number(fee.balance || 0), 0))))),
        h('div', { style: { display: 'flex', gap: 8, marginBottom: 12 } }, ['all', 'unpaid', 'partial', 'paid'].map(status => h('button', { key: status, className: `btn ${filter === status ? 'btn-primary' : 'btn-ghost'}`, onClick: () => setFilter(status) }, status[0].toUpperCase() + status.slice(1)))),
        h('section', { className: 'card', style: { padding: 0, overflow: 'hidden', marginBottom: 20 } }, h('h2', { style: { padding: '16px 18px', fontSize: 15 } }, `Fee vouchers · ${fees.length}`), h('table', null, h('thead', null, h('tr', null, ...['Student', 'Voucher', 'Period', 'Amount', 'Paid', 'Balance', 'Status', 'Actions'].map(label => h('th', { key: label }, label)))), h('tbody', null, voucherRows)), fees.length === 0 && h('p', { style: { padding: 18, color: 'var(--text3)' } }, 'No fee vouchers have been created.')),
        h('section', { className: 'card', style: { padding: 0, overflow: 'hidden' } }, h('h2', { style: { padding: '16px 18px', fontSize: 15 } }, `Payment ledger · ${payments.length}`), h('table', null, h('thead', null, h('tr', null, ...['Date', 'Receipt', 'Student', 'Voucher', 'Method', 'Account', 'Amount', ''].map(label => h('th', { key: label }, label)))), h('tbody', null, paymentRows)), payments.length === 0 && h('p', { style: { padding: 18, color: 'var(--text3)' } }, 'Payments recorded against vouchers will appear here.')),
        voucherOpen && h(Modal, { title: 'Create fee voucher', onClose: () => setVoucherOpen(false) },
            h(Field, { label: 'Class and section' }, h('select', { value: voucherForm.classKey, onChange: event => setVoucherForm({ ...voucherForm, classKey: event.target.value, studentId: '' }) }, h('option', { value: '' }, 'Choose class and section'), classes.map(item => h('option', { key: item.id, value: `${item.name}::${item.section}` }, `Class ${item.name} · Section ${item.section}`)))),
            h(Field, { label: 'Student' }, h('select', { value: voucherForm.studentId, disabled: !selectedClass, onChange: event => setVoucherForm({ ...voucherForm, studentId: event.target.value }) }, h('option', { value: '' }, selectedClass ? 'Choose student' : 'Choose a class first'), voucherStudents.map(student => h('option', { key: student.id, value: student.id }, student.name)))),
            h(Field, { label: 'Fee period' }, h('input', { value: voucherForm.month, onChange: event => setVoucherForm({ ...voucherForm, month: event.target.value }) })),
            h(Field, { label: 'Amount' }, h('input', { type: 'number', min: 1, value: voucherForm.amount, onChange: event => setVoucherForm({ ...voucherForm, amount: event.target.value }) })),
            h(Field, { label: 'Due date' }, h('input', { type: 'date', value: voucherForm.dueDate, onChange: event => setVoucherForm({ ...voucherForm, dueDate: event.target.value }) })),
            h('div', { style: { display: 'flex', justifyContent: 'flex-end', gap: 8 } }, h('button', { className: 'btn btn-ghost', onClick: () => setVoucherOpen(false) }, 'Cancel'), h('button', { className: 'btn btn-primary', disabled: !selectedClass || voucherStudents.length === 0, onClick: createVoucher }, 'Create and print'))),
        paymentFee !== null && h(Modal, { title: 'Record fee payment', onClose: () => setPaymentFee(null) },
            h('p', { style: { color: 'var(--text2)', marginBottom: 14 } }, `Remaining balance: ${money((fees.find(fee => fee.id === paymentFee) || {}).balance)}`),
            h(Field, { label: 'Payment amount' }, h('input', { type: 'number', min: 1, max: (fees.find(fee => fee.id === paymentFee) || {}).balance, value: paymentForm.amount, onChange: event => setPaymentForm({ ...paymentForm, amount: event.target.value }) })),
            h(Field, { label: 'Payment method' }, h('select', { value: paymentForm.method, onChange: event => setPaymentForm({ ...paymentForm, method: event.target.value }) }, h('option', { value: 'Cash' }, 'Cash'), h('option', { value: 'Bank transfer' }, 'Bank transfer'), h('option', { value: 'Other' }, 'Other'))),
            h(Field, { label: 'Account' }, h('select', { value: paymentForm.account, onChange: event => setPaymentForm({ ...paymentForm, account: event.target.value }) }, h('option', { value: 'Cash account' }, 'Cash account'), h('option', { value: 'Bank account' }, 'Bank account'), h('option', { value: 'Other account' }, 'Other account'))),
            h('div', { style: { display: 'flex', justifyContent: 'flex-end', gap: 8 } }, h('button', { className: 'btn btn-ghost', onClick: () => setPaymentFee(null) }, 'Cancel'), h('button', { className: 'btn btn-primary', onClick: collectPayment }, 'Record and print receipt'))));
};

// ─── Exams ─────────────────────────────────────────────────────────────────
const Exams = ({
    exams,
    setExams,
    students = [],
    results,
    setResults,
    toast,
    canEdit,
    canAdd
}) => {
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({});
    const [resultModal, setResultModal] = useState(null);
    const [rForm, setRForm] = useState({});
    const [selectedExamId, setSelectedExamId] = useState(null);
    const save = () => {
        if (modal === 'add') {
            setExams(p => [...p, {
                ...form,
                id: Date.now()
            }]);
            toast('Exam created', 'success');
        } else {
            setExams(p => p.map(e => e.id === form.id ? {
                ...e,
                ...form
            } : e));
            toast('Exam updated', 'success');
        }
        setModal(null);
    };
    const saveResult = () => {
        const pct = Math.round(rForm.marksObtained / rForm.maxMarks * 100);
        const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : pct >= 50 ? 'D' : 'F';
        setResults(p => [...p, {
            ...rForm,
            id: Date.now(),
            grade,
            remarks: pct >= 80 ? 'Excellent' : pct >= 60 ? 'Good' : pct >= 40 ? 'Satisfactory' : 'Needs Improvement'
        }]);
        toast('Result added', 'success');
        setResultModal(null);
    };
    return /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 12
        }
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h1", {
        style: {
            fontSize: 20,
            fontWeight: 700
        }
    }, "Exams & Results"), /*#__PURE__*/ React.createElement("p", {
        style: {
            fontSize: 12,
            color: 'var(--text3)',
            marginTop: 2
        }
    }, exams.length, " exams scheduled")), canAdd && /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-primary",
        onClick: () => {
            setForm({
                name: '',
                class: '10',
                subject: '',
                date: '',
                maxMarks: 100,
                passMarks: 40,
                status: 'upcoming'
            });
            setModal('add');
        }
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "plus",
        s: 15
    }), "New Exam")), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
            gap: 14,
            marginBottom: 24
        }
    }, exams.map(e => /*#__PURE__*/ React.createElement("div", {
        key: e.id,
        className: "card",
        style: {
            borderLeft: `3px solid ${e.status === 'upcoming' ? 'var(--blue)' : e.status === 'ongoing' ? 'var(--amber)' : 'var(--green)'}`
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 10
        }
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontWeight: 600,
            fontSize: 14,
            color: 'var(--text)'
        }
    }, e.name), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 12,
            color: 'var(--text3)',
            marginTop: 2
        }
    }, e.subject, " \u2014 Class ", e.class)), /*#__PURE__*/ React.createElement("span", {
        className: `badge ${e.status === 'upcoming' ? 'badge-blue' : e.status === 'ongoing' ? 'badge-amber' : 'badge-green'}`
    }, e.status)), /*#__PURE__*/ React.createElement("button", {
        type: "button",
        className: "btn btn-ghost",
        style: { width: '100%', justifyContent: 'space-between', marginBottom: 10, fontSize: 12 },
        onClick: () => setSelectedExamId(selectedExamId === e.id ? null : e.id)
    }, selectedExamId === e.id ? 'Hide students' : 'Show students', ` (${students.filter(student => student.status !== 'inactive' && String(student.class) === String(e.class)).length})`), selectedExamId === e.id && /*#__PURE__*/ React.createElement("div", {
        style: { background: 'var(--bg3)', borderRadius: 6, padding: 10, marginBottom: 12 }
    }, /*#__PURE__*/ React.createElement("div", {
        style: { fontSize: 11, fontWeight: 600, color: 'var(--text3)', marginBottom: 6 }
    }, "Students in Class ", e.class), students.filter(student => student.status !== 'inactive' && String(student.class) === String(e.class)).length > 0 ? students.filter(student => student.status !== 'inactive' && String(student.class) === String(e.class)).map(student => /*#__PURE__*/ React.createElement("div", {
        key: student.id,
        style: { display: 'flex', justifyContent: 'space-between', gap: 8, padding: '5px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }
    }, /*#__PURE__*/ React.createElement("span", null, student.name), /*#__PURE__*/ React.createElement("span", {
        style: { color: 'var(--text3)' }
    }, student.section ? `Section ${student.section}` : student.admNo || ''))) : /*#__PURE__*/ React.createElement("div", {
        style: { fontSize: 12, color: 'var(--text3)' }
    }, "No active students are enrolled in this class.")), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            marginBottom: 12
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            background: 'var(--bg3)',
            borderRadius: 6,
            padding: '6px 10px',
            fontSize: 11
        }
    }, /*#__PURE__*/ React.createElement("span", {
        style: {
            color: 'var(--text3)'
        }
    }, "Date: "), /*#__PURE__*/ React.createElement("span", {
        style: {
            color: 'var(--text)',
            fontFamily: 'var(--mono)'
        }
    }, e.date)), /*#__PURE__*/ React.createElement("div", {
        style: {
            background: 'var(--bg3)',
            borderRadius: 6,
            padding: '6px 10px',
            fontSize: 11
        }
    }, /*#__PURE__*/ React.createElement("span", {
        style: {
            color: 'var(--text3)'
        }
    }, "Max: "), /*#__PURE__*/ React.createElement("span", {
        style: {
            color: 'var(--text)'
        }
    }, e.maxMarks)), /*#__PURE__*/ React.createElement("div", {
        style: {
            background: 'var(--bg3)',
            borderRadius: 6,
            padding: '6px 10px',
            fontSize: 11
        }
    }, /*#__PURE__*/ React.createElement("span", {
        style: {
            color: 'var(--text3)'
        }
    }, "Pass: "), /*#__PURE__*/ React.createElement("span", {
        style: {
            color: 'var(--text)'
        }
    }, e.passMarks))), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            gap: 6
        }
    }, canEdit && /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-ghost",
        style: {
            flex: 1,
            fontSize: 11,
            justifyContent: 'center'
        },
        onClick: () => {
            setForm({
                ...e
            });
            setModal('edit');
        }
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "edit",
        s: 13
    }), "Edit"), canAdd && /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-primary",
        style: {
            flex: 1,
            fontSize: 11,
            justifyContent: 'center'
        },
        onClick: () => {
            setRForm({
                examName: e.name,
                subject: e.subject,
                maxMarks: e.maxMarks,
                marksObtained: 0,
                studentName: '',
                class: `${e.class}A`
            });
            setResultModal(true);
        }
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "plus",
        s: 13
    }), "Add Result"))))), /*#__PURE__*/ React.createElement("div", {
        style: {
            marginBottom: 12
        }
    }, /*#__PURE__*/ React.createElement("h2", {
        style: {
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--text)'
        }
    }, "Results")), /*#__PURE__*/ React.createElement("div", {
        className: "card",
        style: {
            padding: 0,
            overflow: 'hidden'
        }
    }, /*#__PURE__*/ React.createElement("table", null, /*#__PURE__*/ React.createElement("thead", null, /*#__PURE__*/ React.createElement("tr", null, /*#__PURE__*/ React.createElement("th", null, "Student"), /*#__PURE__*/ React.createElement("th", null, "Exam"), /*#__PURE__*/ React.createElement("th", null, "Subject"), /*#__PURE__*/ React.createElement("th", null, "Marks"), /*#__PURE__*/ React.createElement("th", null, "Percentage"), /*#__PURE__*/ React.createElement("th", null, "Grade"), /*#__PURE__*/ React.createElement("th", null, "Remarks"))), /*#__PURE__*/ React.createElement("tbody", null, results.map(r => {
        const pct = Math.round(r.marksObtained / r.maxMarks * 100);
        return /*#__PURE__*/ React.createElement("tr", {
            key: r.id
        }, /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("div", {
            style: {
                fontWeight: 500,
                color: 'var(--text)'
            }
        }, r.studentName), /*#__PURE__*/ React.createElement("div", {
            style: {
                fontSize: 11,
                color: 'var(--text3)'
            }
        }, r.class)), /*#__PURE__*/ React.createElement("td", {
            style: {
                fontSize: 12,
                color: 'var(--text2)'
            }
        }, r.examName), /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("span", {
            className: "badge badge-purple"
        }, r.subject)), /*#__PURE__*/ React.createElement("td", {
            style: {
                fontWeight: 600,
                color: 'var(--text)'
            }
        }, r.marksObtained, /*#__PURE__*/ React.createElement("span", {
            style: {
                color: 'var(--text3)',
                fontWeight: 400
            }
        }, "/", r.maxMarks)), /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("div", {
            style: {
                display: 'flex',
                alignItems: 'center',
                gap: 8
            }
        }, /*#__PURE__*/ React.createElement("div", {
            style: {
                flex: 1,
                height: 6,
                background: 'var(--border)',
                borderRadius: 3,
                overflow: 'hidden'
            }
        }, /*#__PURE__*/ React.createElement("div", {
            style: {
                height: '100%',
                width: `${pct}%`,
                background: pct >= 70 ? 'var(--green)' : pct >= 40 ? 'var(--amber)' : 'var(--red)',
                borderRadius: 3
            }
        })), /*#__PURE__*/ React.createElement("span", {
            style: {
                fontSize: 12,
                color: 'var(--text2)',
                minWidth: 32
            }
        }, pct, "%"))), /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("span", {
            className: `badge ${pct >= 80 ? 'badge-green' : pct >= 60 ? 'badge-blue' : pct >= 40 ? 'badge-amber' : 'badge-red'}`
        }, r.grade)), /*#__PURE__*/ React.createElement("td", {
            style: {
                fontSize: 12,
                color: 'var(--text2)'
            }
        }, r.remarks));
    })))), (modal === 'add' || modal === 'edit') && /*#__PURE__*/ React.createElement(Modal, {
        title: modal === 'add' ? 'Create Exam' : 'Edit Exam',
        onClose: () => setModal(null)
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12
        }
    }, /*#__PURE__*/ React.createElement(Field, {
        label: "Exam Name"
    }, /*#__PURE__*/ React.createElement("input", {
        value: form.name || '',
        onChange: e => setForm({
            ...form,
            name: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Subject",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        value: form.subject || '',
        onChange: e => setForm({
            ...form,
            subject: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Class",
        half: true
    }, /*#__PURE__*/ React.createElement("select", {
        value: form.class || '10',
        onChange: e => setForm({
            ...form,
            class: e.target.value
        })
    }, ['6', '7', '8', '9', '10'].map(c => /*#__PURE__*/ React.createElement("option", {
        key: c,
        value: c
    }, "Class ", c)))), /*#__PURE__*/ React.createElement(Field, {
        label: "Date",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        type: "date",
        value: form.date || '',
        onChange: e => setForm({
            ...form,
            date: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Status",
        half: true
    }, /*#__PURE__*/ React.createElement("select", {
        value: form.status || 'upcoming',
        onChange: e => setForm({
            ...form,
            status: e.target.value
        })
    }, /*#__PURE__*/ React.createElement("option", {
        value: "upcoming"
    }, "Upcoming"), /*#__PURE__*/ React.createElement("option", {
        value: "ongoing"
    }, "Ongoing"), /*#__PURE__*/ React.createElement("option", {
        value: "completed"
    }, "Completed"))), /*#__PURE__*/ React.createElement(Field, {
        label: "Max Marks",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        type: "number",
        value: form.maxMarks || 100,
        onChange: e => setForm({
            ...form,
            maxMarks: +e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Pass Marks",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        type: "number",
        value: form.passMarks || 40,
        onChange: e => setForm({
            ...form,
            passMarks: +e.target.value
        })
    }))), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            marginTop: 20
        }
    }, /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-ghost",
        onClick: () => setModal(null)
    }, "Cancel"), /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-primary",
        onClick: save
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "check",
        s: 15
    }), modal === 'add' ? 'Create' : 'Save'))), resultModal && /*#__PURE__*/ React.createElement(Modal, {
        title: "Add Result",
        onClose: () => setResultModal(null)
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12
        }
    }, /*#__PURE__*/ React.createElement(Field, {
        label: "Student Name",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        value: rForm.studentName || '',
        onChange: e => setRForm({
            ...rForm,
            studentName: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Class",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        value: rForm.class || '',
        onChange: e => setRForm({
            ...rForm,
            class: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Marks Obtained",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        type: "number",
        value: rForm.marksObtained || 0,
        onChange: e => setRForm({
            ...rForm,
            marksObtained: +e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Max Marks",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        type: "number",
        value: rForm.maxMarks || 100,
        onChange: e => setRForm({
            ...rForm,
            maxMarks: +e.target.value
        })
    }))), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            marginTop: 20
        }
    }, /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-ghost",
        onClick: () => setResultModal(null)
    }, "Cancel"), /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-primary",
        onClick: saveResult
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "check",
        s: 15
    }), "Add Result"))));
};

// ─── Inventory ─────────────────────────────────────────────────────────────
const Inventory = ({
    inventory,
    setInventory,
    toast,
    canEdit,
    canAdd,
    canDelete
}) => {
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('all');
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({});
    const cats = ['all', ...new Set(inventory.map(i => i.category))];
    const filtered = inventory.filter(i => (catFilter === 'all' || i.category === catFilter) && (i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase())));
    const save = () => {
        const status = form.quantity <= 0 ? 'out-of-stock' : form.quantity <= form.minStock ? 'low-stock' : 'in-stock';
        if (modal === 'add') {
            setInventory(p => [...p, {
                ...form,
                id: Date.now(),
                status
            }]);
            toast('Item added', 'success');
        } else {
            setInventory(p => p.map(i => i.id === form.id ? {
                ...i,
                ...form,
                status
            } : i));
            toast('Item updated', 'success');
        }
        setModal(null);
    };
    const lowStock = inventory.filter(i => i.status === 'low-stock' || i.status === 'out-of-stock');
    const totalValue = inventory.reduce((a, b) => a + b.quantity * b.unitPrice, 0);
    return /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 12
        }
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h1", {
        style: {
            fontSize: 20,
            fontWeight: 700
        }
    }, "Inventory"), /*#__PURE__*/ React.createElement("p", {
        style: {
            fontSize: 12,
            color: 'var(--text3)',
            marginTop: 2
        }
    }, inventory.length, " items tracked")), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            position: 'relative'
        }
    }, /*#__PURE__*/ React.createElement("input", {
        placeholder: "Search items...",
        value: search,
        onChange: e => setSearch(e.target.value),
        style: {
            paddingLeft: 12,
            width: 200
        }
    })), canAdd && /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-primary",
        onClick: () => {
            setForm({
                name: '',
                category: 'Stationery',
                sku: '',
                quantity: 0,
                minStock: 10,
                unitPrice: 0,
                supplier: '',
                location: '',
                lastPurchase: ''
            });
            setModal('add');
        }
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "plus",
        s: 15
    }), "Add Item"))), lowStock.length > 0 && /*#__PURE__*/ React.createElement("div", {
        style: {
            background: 'var(--amberbg)',
            border: '1px solid rgba(251,191,36,.2)',
            borderRadius: 10,
            padding: '12px 16px',
            marginBottom: 16,
            display: 'flex',
            gap: 10,
            alignItems: 'center'
        }
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "alert",
        s: 16,
        style: {
            color: 'var(--amber)',
            flexShrink: 0
        }
    }), /*#__PURE__*/ React.createElement("span", {
        style: {
            fontSize: 13,
            color: 'var(--amber)'
        }
    }, /*#__PURE__*/ React.createElement("strong", null, lowStock.length, " items"), " with low or zero stock: ", lowStock.map(i => i.name).join(', '))), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
            gap: 12,
            marginBottom: 16
        }
    }, /*#__PURE__*/ React.createElement("div", {
        className: "card"
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 11,
            color: 'var(--text3)',
            textTransform: 'uppercase',
            letterSpacing: .6,
            marginBottom: 6
        }
    }, "Total Items"), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--text)'
        }
    }, inventory.length)), /*#__PURE__*/ React.createElement("div", {
        className: "card"
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 11,
            color: 'var(--text3)',
            textTransform: 'uppercase',
            letterSpacing: .6,
            marginBottom: 6
        }
    }, "Total Value"), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--green)'
        }
    }, "\u20A8", (totalValue / 1000).toFixed(0), "k")), /*#__PURE__*/ React.createElement("div", {
        className: "card",
        style: {
            background: 'var(--redbg)',
            border: '1px solid rgba(248,113,113,.2)'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 11,
            color: 'var(--red)',
            textTransform: 'uppercase',
            letterSpacing: .6,
            marginBottom: 6
        }
    }, "Low Stock"), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--red)'
        }
    }, lowStock.length)), /*#__PURE__*/ React.createElement("div", {
        className: "card"
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 11,
            color: 'var(--text3)',
            textTransform: 'uppercase',
            letterSpacing: .6,
            marginBottom: 6
        }
    }, "Categories"), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--text)'
        }
    }, new Set(inventory.map(i => i.category)).size))), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            gap: 8,
            marginBottom: 14,
            flexWrap: 'wrap'
        }
    }, cats.map(c => /*#__PURE__*/ React.createElement("button", {
        key: c,
        className: `btn ${catFilter === c ? 'btn-primary' : 'btn-ghost'}`,
        style: {
            fontSize: 12,
            padding: '6px 12px'
        },
        onClick: () => setCatFilter(c)
    }, c))), /*#__PURE__*/ React.createElement("div", {
        className: "card",
        style: {
            padding: 0,
            overflow: 'hidden'
        }
    }, /*#__PURE__*/ React.createElement("table", null, /*#__PURE__*/ React.createElement("thead", null, /*#__PURE__*/ React.createElement("tr", null, /*#__PURE__*/ React.createElement("th", null, "Item"), /*#__PURE__*/ React.createElement("th", null, "SKU"), /*#__PURE__*/ React.createElement("th", null, "Category"), /*#__PURE__*/ React.createElement("th", null, "Stock"), /*#__PURE__*/ React.createElement("th", null, "Min Stock"), /*#__PURE__*/ React.createElement("th", null, "Unit Price"), /*#__PURE__*/ React.createElement("th", null, "Value"), /*#__PURE__*/ React.createElement("th", null, "Status"), canEdit && /*#__PURE__*/ React.createElement("th", null, "Actions"))), /*#__PURE__*/ React.createElement("tbody", null, filtered.map(item => /*#__PURE__*/ React.createElement("tr", {
        key: item.id
    }, /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontWeight: 500,
            color: 'var(--text)'
        }
    }, item.name), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 11,
            color: 'var(--text3)'
        }
    }, item.location)), /*#__PURE__*/ React.createElement("td", {
        style: {
            fontSize: 11,
            fontFamily: 'var(--mono)',
            color: 'var(--text3)'
        }
    }, item.sku), /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("span", {
        className: "badge badge-purple"
    }, item.category)), /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("span", {
        style: {
            fontSize: 14,
            fontWeight: 600,
            color: item.quantity <= 0 ? 'var(--red)' : item.quantity <= item.minStock ? 'var(--amber)' : 'var(--green)'
        }
    }, item.quantity)), /*#__PURE__*/ React.createElement("td", {
        style: {
            color: 'var(--text3)',
            fontSize: 12
        }
    }, item.minStock), /*#__PURE__*/ React.createElement("td", {
        style: {
            fontSize: 13,
            color: 'var(--text)'
        }
    }, "\u20A8", item.unitPrice.toLocaleString()), /*#__PURE__*/ React.createElement("td", {
        style: {
            fontSize: 13,
            color: 'var(--text)',
            fontWeight: 500
        }
    }, "\u20A8", (item.quantity * item.unitPrice).toLocaleString()), /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("span", {
        className: `badge ${item.status === 'in-stock' ? 'badge-green' : item.status === 'low-stock' ? 'badge-amber' : 'badge-red'}`
    }, item.status)), canEdit && /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            gap: 6
        }
    }, /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-ghost",
        style: {
            padding: '4px 8px'
        },
        onClick: () => {
            setForm({
                ...item
            });
            setModal('edit');
        }
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "edit",
        s: 13
    })), canDelete && /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-danger",
        style: {
            padding: '4px 8px'
        },
        onClick: () => {
            setInventory(p => p.filter(i => i.id !== item.id));
            toast('Item removed', 'error');
        }
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "trash",
        s: 13
    }))))))))), (modal === 'add' || modal === 'edit') && /*#__PURE__*/ React.createElement(Modal, {
        title: modal === 'add' ? 'Add Inventory Item' : 'Edit Item',
        onClose: () => setModal(null),
        wide: true
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12
        }
    }, /*#__PURE__*/ React.createElement(Field, {
        label: "Item Name",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        value: form.name || '',
        onChange: e => setForm({
            ...form,
            name: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "SKU",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        value: form.sku || '',
        onChange: e => setForm({
            ...form,
            sku: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Category",
        half: true
    }, /*#__PURE__*/ React.createElement("select", {
        value: form.category || 'Stationery',
        onChange: e => setForm({
            ...form,
            category: e.target.value
        })
    }, ['Furniture', 'Technology', 'Stationery', 'Uniform', 'Books', 'Sports', 'Lab', 'Other'].map(c => /*#__PURE__*/ React.createElement("option", {
        key: c,
        value: c
    }, c)))), /*#__PURE__*/ React.createElement(Field, {
        label: "Quantity",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        type: "number",
        value: form.quantity || 0,
        onChange: e => setForm({
            ...form,
            quantity: +e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Min Stock Level",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        type: "number",
        value: form.minStock || 10,
        onChange: e => setForm({
            ...form,
            minStock: +e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Unit Price (\u20A8)",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        type: "number",
        value: form.unitPrice || 0,
        onChange: e => setForm({
            ...form,
            unitPrice: +e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Supplier",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        value: form.supplier || '',
        onChange: e => setForm({
            ...form,
            supplier: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Location",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        value: form.location || '',
        onChange: e => setForm({
            ...form,
            location: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Last Purchase Date"
    }, /*#__PURE__*/ React.createElement("input", {
        type: "date",
        value: form.lastPurchase || '',
        onChange: e => setForm({
            ...form,
            lastPurchase: e.target.value
        })
    }))), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            marginTop: 20
        }
    }, /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-ghost",
        onClick: () => setModal(null)
    }, "Cancel"), /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-primary",
        onClick: save
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "check",
        s: 15
    }), modal === 'add' ? 'Add Item' : 'Save'))));
};

// ─── Users & Permissions ───────────────────────────────────────────────────
const Users = ({
    users,
    setUsers,
    toast
}) => {
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({});
    const [permUser, setPermUser] = useState(null);
    const openAdd = () => setForm({
        name: '',
        email: '',
        username: '',
        password: '',
        role: 'teacher',
        status: 'active',
        permissions: ['dashboard']
    });
    const saveUser = () => {
        if (modal === 'add') {
            setUsers(p => [...p, {
                ...form,
                id: Date.now(),
                joined: new Date().toISOString().split('T')[0],
                avatar: form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
            }]);
            toast('User created', 'success');
        } else {
            setUsers(p => p.map(u => u.id === form.id ? {
                ...u,
                ...form
            } : u));
            toast('User updated', 'success');
        }
        setModal(null);
    };
    const togglePerm = (userId, perm) => {
        setUsers(p => p.map(u => {
            if (u.id !== userId) return u;
            const perms = u.permissions || [];
            return {
                ...u,
                permissions: perms.includes(perm) ? perms.filter(p => p !== perm) : [...perms, perm]
            };
        }));
        toast('Permission updated', 'info');
    };
    const roleColors = {
        admin: 'red',
        teacher: 'blue',
        student: 'green',
        staff: 'amber',
        accountant: 'purple'
    };
    return /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 12
        }
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h1", {
        style: {
            fontSize: 20,
            fontWeight: 700
        }
    }, "Users & Roles"), /*#__PURE__*/ React.createElement("p", {
        style: {
            fontSize: 12,
            color: 'var(--text3)',
            marginTop: 2
        }
    }, users.length, " system users")), /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-primary",
        onClick: () => {
            openAdd();
            setModal('add');
        }
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "plus",
        s: 15
    }), "Add User")), /*#__PURE__*/ React.createElement("div", {
        className: "card",
        style: {
            padding: 0,
            overflow: 'hidden',
            marginBottom: 20
        }
    }, /*#__PURE__*/ React.createElement("table", null, /*#__PURE__*/ React.createElement("thead", null, /*#__PURE__*/ React.createElement("tr", null, /*#__PURE__*/ React.createElement("th", null, "User"), /*#__PURE__*/ React.createElement("th", null, "Username"), /*#__PURE__*/ React.createElement("th", null, "Role"), /*#__PURE__*/ React.createElement("th", null, "Permissions"), /*#__PURE__*/ React.createElement("th", null, "Joined"), /*#__PURE__*/ React.createElement("th", null, "Status"), /*#__PURE__*/ React.createElement("th", null, "Actions"))), /*#__PURE__*/ React.createElement("tbody", null, users.map(u => /*#__PURE__*/ React.createElement("tr", {
        key: u.id
    }, /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            alignItems: 'center',
            gap: 10
        }
    }, /*#__PURE__*/ React.createElement(Avatar, {
        initials: u.avatar,
        size: 32,
        color: roleColors[u.role] || 'blue',
        image: u.image
    }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontWeight: 500,
            color: 'var(--text)'
        }
    }, u.name), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 11,
            color: 'var(--text3)'
        }
    }, u.email)))), /*#__PURE__*/ React.createElement("td", {
        style: {
            fontFamily: 'var(--mono)',
            fontSize: 12,
            color: 'var(--text2)'
        }
    }, u.username), /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("span", {
        className: `badge badge-${roleColors[u.role] || 'blue'}`
    }, u.role)), /*#__PURE__*/ React.createElement("td", {
        style: {
            fontSize: 12,
            color: 'var(--text3)'
        }
    }, (u.permissions || []).length, " modules"), /*#__PURE__*/ React.createElement("td", {
        style: {
            fontSize: 12,
            color: 'var(--text3)',
            fontFamily: 'var(--mono)'
        }
    }, u.joined), /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("span", {
        className: `badge ${u.status === 'active' ? 'badge-green' : 'badge-red'}`
    }, u.status)), /*#__PURE__*/ React.createElement("td", null, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            gap: 6
        }
    }, /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-ghost",
        style: {
            padding: '4px 10px',
            fontSize: 11
        },
        onClick: () => setPermUser(u)
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "key",
        s: 13
    }), "Perms"), /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-ghost",
        style: {
            padding: '4px 8px'
        },
        onClick: () => {
            setForm({
                ...u
            });
            setModal('edit');
        }
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "edit",
        s: 13
    })), u.role !== 'admin' && /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-danger",
        style: {
            padding: '4px 8px'
        },
        onClick: () => {
            setUsers(p => p.filter(x => x.id !== u.id));
            toast('User deleted', 'error');
        }
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "trash",
        s: 13
    }))))))))), (modal === 'add' || modal === 'edit') && /*#__PURE__*/ React.createElement(Modal, {
        title: modal === 'add' ? 'Create User' : 'Edit User',
        onClose: () => setModal(null)
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12
        }
    }, /*#__PURE__*/ React.createElement(Field, {
        label: "Profile Photo"
    }, /*#__PURE__*/ React.createElement(ImageUpload, {
        value: form.image || '',
        onChange: image => setForm({
            ...form,
            image
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Full Name",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        value: form.name || '',
        onChange: e => setForm({
            ...form,
            name: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Username",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        value: form.username || '',
        onChange: e => setForm({
            ...form,
            username: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Email"
    }, /*#__PURE__*/ React.createElement("input", {
        type: "email",
        value: form.email || '',
        onChange: e => setForm({
            ...form,
            email: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Password",
        half: true
    }, /*#__PURE__*/ React.createElement("input", {
        type: "password",
        value: form.password || '',
        onChange: e => setForm({
            ...form,
            password: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Role",
        half: true
    }, /*#__PURE__*/ React.createElement("select", {
        value: form.role || 'teacher',
        onChange: e => setForm({
            ...form,
            role: e.target.value
        })
    }, ROLES.map(r => /*#__PURE__*/ React.createElement("option", {
        key: r,
        value: r
    }, r.charAt(0).toUpperCase() + r.slice(1))))), /*#__PURE__*/ React.createElement(Field, {
        label: "Status"
    }, /*#__PURE__*/ React.createElement("select", {
        value: form.status || 'active',
        onChange: e => setForm({
            ...form,
            status: e.target.value
        })
    }, /*#__PURE__*/ React.createElement("option", {
        value: "active"
    }, "Active"), /*#__PURE__*/ React.createElement("option", {
        value: "inactive"
    }, "Inactive")))), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10,
            marginTop: 20
        }
    }, /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-ghost",
        onClick: () => setModal(null)
    }, "Cancel"), /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-primary",
        onClick: saveUser
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "check",
        s: 15
    }), modal === 'add' ? 'Create User' : 'Save'))), permUser && /*#__PURE__*/ React.createElement(Modal, {
        title: `Permissions — ${permUser.name}`,
        onClose: () => setPermUser(null),
        wide: true
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            marginBottom: 14,
            padding: '10px 14px',
            background: 'var(--bg3)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 10
        }
    }, /*#__PURE__*/ React.createElement(Avatar, {
        initials: permUser.avatar,
        size: 32,
        color: roleColors[permUser.role] || 'blue',
        image: permUser.image
    }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontWeight: 500,
            fontSize: 14,
            color: 'var(--text)'
        }
    }, permUser.name), /*#__PURE__*/ React.createElement("span", {
        className: `badge badge-${roleColors[permUser.role] || 'blue'}`
    }, permUser.role))), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8
        }
    }, PERMISSIONS.map(p => {
        const active = (permUser.permissions || []).includes(p);
        const moduleUser = users.find(u => u.id === permUser.id);
        return /*#__PURE__*/ React.createElement("div", {
            key: p,
            onClick: () => {
                togglePerm(permUser.id, p);
                setPermUser(u => ({
                    ...u,
                    permissions: active ? u.permissions.filter(x => x !== p) : [...u.permissions, p]
                }));
            },
            style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--bg3)',
                border: `1px solid ${active ? 'rgba(79,142,247,.3)' : 'var(--border)'}`,
                borderRadius: 8,
                padding: '10px 14px',
                cursor: 'pointer',
                transition: 'all .2s'
            }
        }, /*#__PURE__*/ React.createElement("div", {
            style: {
                display: 'flex',
                alignItems: 'center',
                gap: 8
            }
        }, /*#__PURE__*/ React.createElement(Icon, {
            n: p === 'dashboard' ? 'home' : p === 'students' ? 'student' : p === 'teachers' ? 'teacher' : p === 'attendance' ? 'attendance' : p === 'fees' ? 'fee' : p === 'exams' ? 'exam' : p === 'results' ? 'result' : p === 'inventory' ? 'inventory' : p === 'reports' ? 'report' : p === 'settings' ? 'settings' : 'users',
            s: 15,
            style: {
                color: active ? 'var(--blue)' : 'var(--text3)'
            }
        }), /*#__PURE__*/ React.createElement("span", {
            style: {
                fontSize: 13,
                fontWeight: 500,
                color: active ? 'var(--text)' : 'var(--text2)',
                textTransform: 'capitalize'
            }
        }, p)), /*#__PURE__*/ React.createElement(PermToggle, {
            checked: active,
            onChange: () => {}
        }));
    })), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 16
        }
    }, /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-primary",
        onClick: () => setPermUser(null)
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "check",
        s: 15
    }), "Done"))));
};

// ─── Reports ───────────────────────────────────────────────────────────────
const Reports = ({
    students,
    fees,
    attendance,
    exams,
    results
}) => {
    const feeRate = Math.round(fees.filter(f => f.status === 'paid').length / fees.length * 100);
    const attRate = Math.round(attendance.filter(a => a.status === 'present').length / attendance.length * 100);
    return /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        style: {
            marginBottom: 20
        }
    }, /*#__PURE__*/ React.createElement("h1", {
        style: {
            fontSize: 20,
            fontWeight: 700
        }
    }, "Reports & Analytics"), /*#__PURE__*/ React.createElement("p", {
        style: {
            fontSize: 12,
            color: 'var(--text3)',
            marginTop: 2
        }
    }, "School performance overview")), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
            gap: 16,
            marginBottom: 24
        }
    }, [{
        t: 'Student Enrollment',
        v: students.length,
        sub: `${students.filter(s => s.status === 'active').length} active`,
        c: 'var(--blue)',
        pct: Math.round(students.filter(s => s.status === 'active').length / students.length * 100)
    }, {
        t: 'Fee Collection Rate',
        v: `${feeRate}%`,
        sub: `${fees.filter(f => f.status === 'paid').length} of ${fees.length} paid`,
        c: 'var(--green)',
        pct: feeRate
    }, {
        t: 'Attendance Rate',
        v: `${attRate}%`,
        sub: `${attendance.filter(a => a.status === 'present').length} present today`,
        c: 'var(--amber)',
        pct: attRate
    }, {
        t: 'Pass Rate (Exams)',
        v: `${Math.round(results.filter(r => parseInt(r.marksObtained) * 100 / parseInt(r.maxMarks) >= 40).length / Math.max(results.length, 1) * 100)}%`,
        sub: `${results.length} results recorded`,
        c: 'var(--purple)',
        pct: Math.round(results.filter(r => parseInt(r.marksObtained) * 100 / parseInt(r.maxMarks) >= 40).length / Math.max(results.length, 1) * 100)
    }].map(item => /*#__PURE__*/ React.createElement("div", {
        key: item.t,
        className: "card"
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--text3)',
            textTransform: 'uppercase',
            letterSpacing: .6
        }
    }, item.t), /*#__PURE__*/ React.createElement(MiniDonut, {
        value: item.pct,
        max: 100,
        color: item.c,
        size: 52
    })), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 26,
            fontWeight: 700,
            color: 'var(--text)'
        }
    }, item.v), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 12,
            color: 'var(--text3)',
            marginTop: 3
        }
    }, item.sub)))), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            marginBottom: 16
        }
    }, /*#__PURE__*/ React.createElement("div", {
        className: "card"
    }, /*#__PURE__*/ React.createElement("h3", {
        style: {
            fontWeight: 600,
            fontSize: 14,
            marginBottom: 14
        }
    }, "Class-wise Students"), ['10', '9', '8', '7', '6'].map(cls => {
        const cnt = students.filter(s => s.class === cls).length;
        return /*#__PURE__*/ React.createElement("div", {
            key: cls,
            style: {
                marginBottom: 10
            }
        }, /*#__PURE__*/ React.createElement("div", {
            style: {
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 4,
                fontSize: 12
            }
        }, /*#__PURE__*/ React.createElement("span", {
            style: {
                color: 'var(--text2)'
            }
        }, "Class ", cls), /*#__PURE__*/ React.createElement("span", {
            style: {
                color: 'var(--text)',
                fontWeight: 600
            }
        }, cnt, " students")), /*#__PURE__*/ React.createElement("div", {
            style: {
                height: 8,
                background: 'var(--border)',
                borderRadius: 4,
                overflow: 'hidden'
            }
        }, /*#__PURE__*/ React.createElement("div", {
            style: {
                height: '100%',
                width: `${cnt / students.length * 100}%`,
                background: `hsl(${210 + cls * 10},70%,55%)`,
                borderRadius: 4
            }
        })));
    })), /*#__PURE__*/ React.createElement("div", {
        className: "card"
    }, /*#__PURE__*/ React.createElement("h3", {
        style: {
            fontWeight: 600,
            fontSize: 14,
            marginBottom: 14
        }
    }, "Fee Status Breakdown"), [{
        l: 'Paid',
        f: 'paid',
        c: 'var(--green)'
    }, {
        l: 'Unpaid',
        f: 'unpaid',
        c: 'var(--red)'
    }, {
        l: 'Partial',
        f: 'partial',
        c: 'var(--amber)'
    }].map(item => {
        const cnt = fees.filter(f => f.status === item.f).length;
        const val = fees.filter(f => f.status === item.f).reduce((a, b) => a + b.paid, 0);
        return /*#__PURE__*/ React.createElement("div", {
            key: item.l,
            style: {
                display: 'flex',
                gap: 12,
                padding: '10px 12px',
                marginBottom: 6,
                background: 'var(--bg3)',
                borderRadius: 8,
                alignItems: 'center'
            }
        }, /*#__PURE__*/ React.createElement("div", {
            style: {
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: item.c,
                flexShrink: 0
            }
        }), /*#__PURE__*/ React.createElement("span", {
            style: {
                flex: 1,
                fontSize: 13,
                color: 'var(--text)'
            }
        }, item.l), /*#__PURE__*/ React.createElement("span", {
            style: {
                fontSize: 13,
                fontWeight: 600,
                color: item.c
            }
        }, cnt, " students"), /*#__PURE__*/ React.createElement("span", {
            style: {
                fontSize: 12,
                color: 'var(--text3)'
            }
        }, "\u20A8", val.toLocaleString()));
    }), /*#__PURE__*/ React.createElement("div", {
        style: {
            marginTop: 12,
            padding: '10px 12px',
            background: 'var(--bg3)',
            borderRadius: 8,
            borderLeft: '3px solid var(--green)'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 11,
            color: 'var(--text3)',
            marginBottom: 2
        }
    }, "Total Revenue"), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--green)'
        }
    }, "\u20A8", fees.reduce((a, b) => a + b.paid, 0).toLocaleString())))), /*#__PURE__*/ React.createElement("div", {
        className: "card"
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14
        }
    }, /*#__PURE__*/ React.createElement("h3", {
        style: {
            fontWeight: 600,
            fontSize: 14
        }
    }, "Grade Distribution"), /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-ghost",
        style: {
            fontSize: 12
        }
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "download",
        s: 14
    }), "Export PDF")), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap'
        }
    }, ['A+', 'A', 'B', 'C', 'D', 'F'].map(grade => {
        const cnt = results.filter(r => r.grade === grade).length;
        const colors = {
            'A+': 'var(--green)',
            'A': 'var(--cyan)',
            'B': 'var(--blue)',
            'C': 'var(--purple)',
            'D': 'var(--amber)',
            'F': 'var(--red)'
        };
        return /*#__PURE__*/ React.createElement("div", {
            key: grade,
            style: {
                flex: 1,
                minWidth: 80,
                textAlign: 'center',
                padding: '14px 8px',
                background: 'var(--bg3)',
                borderRadius: 10,
                border: `1px solid ${cnt > 0 ? colors[grade] : 'var(--border)'}`
            }
        }, /*#__PURE__*/ React.createElement("div", {
            style: {
                fontSize: 20,
                fontWeight: 700,
                color: colors[grade]
            }
        }, cnt), /*#__PURE__*/ React.createElement("div", {
            style: {
                fontSize: 11,
                color: colors[grade],
                marginTop: 3
            }
        }, "Grade ", grade));
    }))));
};

// ─── Settings ─────────────────────────────────────────────────────────────
const Settings = ({
    user,
    toast,
    schoolName,
    schoolLogo,
    onSaveSchoolName,
    onSaveSchoolLogo
}) => {
    const [form, setForm] = useState({
        schoolName: schoolName || 'Smart School',
        schoolEmail: 'info@smartschool.edu',
        phone: '021-1234567',
        address: 'Block 7, Clifton, Karachi',
        currency: 'PKR',
        timezone: 'Asia/Karachi',
        language: 'English'
    });
    return /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        style: {
            marginBottom: 20
        }
    }, /*#__PURE__*/ React.createElement("h1", {
        style: {
            fontSize: 20,
            fontWeight: 700
        }
    }, "Settings"), /*#__PURE__*/ React.createElement("p", {
        style: {
            fontSize: 12,
            color: 'var(--text3)',
            marginTop: 2
        }
    }, "System configuration")), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16
        }
    }, /*#__PURE__*/ React.createElement("div", {
        className: "card"
    }, /*#__PURE__*/ React.createElement("h3", {
        style: {
            fontWeight: 600,
            fontSize: 14,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8
        }
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "settings",
        s: 16
    }), "School Information"), /*#__PURE__*/ React.createElement(Field, {
        label: "School Name"
    }, /*#__PURE__*/ React.createElement("input", {
        value: form.schoolName,
        onChange: e => setForm({
            ...form,
            schoolName: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "School Logo"
    }, /*#__PURE__*/ React.createElement(ImageUpload, {
        value: schoolLogo,
        onChange: logo => {
            onSaveSchoolLogo(logo);
            toast(logo ? 'School logo updated' : 'School logo removed', 'success');
        }
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Email"
    }, /*#__PURE__*/ React.createElement("input", {
        value: form.schoolEmail,
        onChange: e => setForm({
            ...form,
            schoolEmail: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Phone"
    }, /*#__PURE__*/ React.createElement("input", {
        value: form.phone,
        onChange: e => setForm({
            ...form,
            phone: e.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Address"
    }, /*#__PURE__*/ React.createElement("textarea", {
        rows: 2,
        value: form.address,
        onChange: e => setForm({
            ...form,
            address: e.target.value
        }),
        style: {
            resize: 'vertical'
        }
    })), /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-primary",
        onClick: () => {
            onSaveSchoolName(form.schoolName);
            toast('Settings saved', 'success');
        }
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "check",
        s: 14
    }), "Save Settings")), /*#__PURE__*/ React.createElement("div", {
        className: "card"
    }, /*#__PURE__*/ React.createElement("h3", {
        style: {
            fontWeight: 600,
            fontSize: 14,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8
        }
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "info",
        s: 16
    }), "System Preferences"), /*#__PURE__*/ React.createElement(Field, {
        label: "Currency"
    }, /*#__PURE__*/ React.createElement("select", {
        value: form.currency,
        onChange: e => setForm({
            ...form,
            currency: e.target.value
        })
    }, /*#__PURE__*/ React.createElement("option", {
        value: "PKR"
    }, "PKR (\u20A8)"), /*#__PURE__*/ React.createElement("option", {
        value: "USD"
    }, "USD ($)"), /*#__PURE__*/ React.createElement("option", {
        value: "EUR"
    }, "EUR (\u20AC)"))), /*#__PURE__*/ React.createElement(Field, {
        label: "Timezone"
    }, /*#__PURE__*/ React.createElement("select", {
        value: form.timezone,
        onChange: e => setForm({
            ...form,
            timezone: e.target.value
        })
    }, /*#__PURE__*/ React.createElement("option", {
        value: "Asia/Karachi"
    }, "Asia/Karachi (PKT)"), /*#__PURE__*/ React.createElement("option", {
        value: "UTC"
    }, "UTC"))), /*#__PURE__*/ React.createElement(Field, {
        label: "Language"
    }, /*#__PURE__*/ React.createElement("select", {
        value: form.language,
        onChange: e => setForm({
            ...form,
            language: e.target.value
        })
    }, /*#__PURE__*/ React.createElement("option", {
        value: "English"
    }, "English"), /*#__PURE__*/ React.createElement("option", {
        value: "Urdu"
    }, "\u0627\u0631\u062F\u0648"))), /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-primary",
        onClick: () => toast('Preferences saved', 'success')
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "check",
        s: 14
    }), "Save Preferences")), /*#__PURE__*/ React.createElement("div", {
        className: "card"
    }, /*#__PURE__*/ React.createElement("h3", {
        style: {
            fontWeight: 600,
            fontSize: 14,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8
        }
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "lock",
        s: 16
    }), "Security"), /*#__PURE__*/ React.createElement(Field, {
        label: "Current Password"
    }, /*#__PURE__*/ React.createElement("input", {
        type: "password",
        placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "New Password"
    }, /*#__PURE__*/ React.createElement("input", {
        type: "password",
        placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Confirm Password"
    }, /*#__PURE__*/ React.createElement("input", {
        type: "password",
        placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
    })), /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-primary",
        onClick: () => toast('Password changed', 'success')
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "check",
        s: 14
    }), "Change Password")), /*#__PURE__*/ React.createElement("div", {
        className: "card"
    }, /*#__PURE__*/ React.createElement("h3", {
        style: {
            fontWeight: 600,
            fontSize: 14,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8
        }
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "bell",
        s: 16
    }), "Notifications"), [
        ['Fee reminders', 'Send SMS on pending fees', true],
        ['Attendance alerts', 'Daily attendance summary', true],
        ['Exam notifications', 'Upcoming exam alerts', false],
        ['Stock alerts', 'Low inventory warnings', true]
    ].map(([t, d, on]) => /*#__PURE__*/ React.createElement("div", {
        key: t,
        style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0',
            borderBottom: '1px solid var(--border)'
        }
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--text)'
        }
    }, t), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 11,
            color: 'var(--text3)'
        }
    }, d)), /*#__PURE__*/ React.createElement(PermToggle, {
        checked: on,
        onChange: () => toast('Notification setting updated', 'info')
    }))))));
};

const SchoolMark = ({ logo, size = 38, radius = 10, style = {} }) => /*#__PURE__*/ React.createElement("div", {
    style: {
        width: size,
        height: size,
        borderRadius: radius,
        background: 'var(--bluebg)',
        border: '1px solid rgba(79,142,247,.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--blue)',
        flexShrink: 0,
        overflow: 'hidden',
        ...style
    }
}, logo ? /*#__PURE__*/ React.createElement("img", {
    src: logo,
    alt: "",
    style: { width: '100%', height: '100%', objectFit: 'cover' }
}) : /*#__PURE__*/ React.createElement(Icon, {
    n: "student",
    s: Math.round(size * 0.5)
}));

// ─── Login ────────────────────────────────────────────────────────────────
const FirstAdminSetup = ({ onCreate, schoolName, schoolLogo }) => {
    const [form, setForm] = useState({ name: '', email: '', username: '', password: '' });
    const [error, setError] = useState('');
    const update = (key, value) => setForm(previous => ({...previous, [key]: value }));
    const submit = () => {
        if (!form.name.trim() || !form.username.trim() || !form.email.trim() || form.password.length < 8) {
            setError('Enter your name, email, username, and a password of at least 8 characters.');
            return;
        }
        onCreate(form);
    };

    return /*#__PURE__*/ React.createElement("div", {
        className: "login-page",
        style: { minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg)', padding: 20 }
    }, /*#__PURE__*/ React.createElement("section", {
        className: "card login-card",
        style: { width: '100%', maxWidth: 420, background: 'var(--bg2)', border: '1px solid var(--border2)' }
    }, /*#__PURE__*/ React.createElement(SchoolMark, {
        logo: schoolLogo,
        size: 56,
        radius: 14,
        style: { margin: '0 auto 14px' }
    }), /*#__PURE__*/ React.createElement("h1", { style: { fontSize: 22, marginBottom: 6, textAlign: 'center' } }, schoolName), /*#__PURE__*/ React.createElement("p", {
        style: { color: 'var(--text3)', fontSize: 13, marginBottom: 20 }
    }, "Create the first administrator account"), /*#__PURE__*/ React.createElement(Field, { label: "Full name" }, /*#__PURE__*/ React.createElement("input", {
        autoComplete: 'name',
        value: form.name,
        onChange: event => update('name', event.target.value)
    })), /*#__PURE__*/ React.createElement(Field, { label: "Email" }, /*#__PURE__*/ React.createElement("input", {
        type: 'email',
        autoComplete: 'email',
        value: form.email,
        onChange: event => update('email', event.target.value)
    })), /*#__PURE__*/ React.createElement(Field, { label: "Username" }, /*#__PURE__*/ React.createElement("input", {
        autoComplete: 'username',
        value: form.username,
        onChange: event => update('username', event.target.value)
    })), /*#__PURE__*/ React.createElement(Field, { label: "Password" }, /*#__PURE__*/ React.createElement("input", {
        type: 'password',
        autoComplete: 'new-password',
        value: form.password,
        onChange: event => update('password', event.target.value),
        onKeyDown: event => event.key === 'Enter' && submit()
    })), error && /*#__PURE__*/ React.createElement("div", {
        style: { color: 'var(--red)', fontSize: 12, marginBottom: 12 }
    }, error), /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-primary",
        style: { width: '100%', justifyContent: 'center' },
        onClick: submit
    }, "Create Administrator")));
};

const Login = ({
    onLogin,
    users,
    schoolName,
    schoolLogo
}) => {
    const [form, setForm] = useState({
        username: localStorage.getItem('schoolManagementLastUsername') || '',
        password: ''
    });
    const [error, setError] = useState('');
    const [forgotMode, setForgotMode] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotSent, setForgotSent] = useState(false);
    const handleLogin = () => {
        const user = users.find(u => u.username === form.username && u.password === form.password);
        if (user) {
            if (user.status === 'inactive') {
                setError('Account is deactivated.');
            } else {
                onLogin(user);
            }
        } else {
            setError('Invalid username or password.');
        }
    };
    return /*#__PURE__*/ React.createElement("div", {
        className: "login-page",
        style: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg)',
            padding: 20
        }
    }, /*#__PURE__*/ React.createElement("div", {
        className: "login-decoration",
        style: {
            position: 'fixed',
            inset: 0,
            overflow: 'hidden',
            pointerEvents: 'none'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(79,142,247,.08),transparent 70%)'
        }
    }), /*#__PURE__*/ React.createElement("div", {
        style: {
            position: 'absolute',
            bottom: '15%',
            right: '8%',
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(167,139,250,.06),transparent 70%)'
        }
    }), /*#__PURE__*/ React.createElement("div", {
        style: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(79,142,247,.04),transparent 70%)'
        }
    })), /*#__PURE__*/ React.createElement("section", {
        className: "login-story",
        "aria-labelledby": "login-story-title"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "login-story__content"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "login-story__eyebrow"
    }, `${schoolName.toUpperCase()} · KARACHI`), /*#__PURE__*/ React.createElement("h2", {
        id: "login-story-title"
    }, "A more connected school day."), /*#__PURE__*/ React.createElement("p", null, "Bring classrooms, people, and progress together in one place."), /*#__PURE__*/ React.createElement("div", {
        className: "login-story__footer"
    }, "LEARN  ·  LEAD  ·  GROW"))), /*#__PURE__*/ React.createElement("div", {
        className: "login-panel",
        style: {
            width: '100%',
            maxWidth: 420,
            position: 'relative'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        className: "login-brand",
        style: {
            textAlign: 'center',
            marginBottom: 32
        }
    }, /*#__PURE__*/ React.createElement(SchoolMark, {
        logo: schoolLogo,
        size: 60,
        radius: 16,
        className: "login-brand__mark",
        style: { margin: '0 auto 16px' }
    }), /*#__PURE__*/ React.createElement("h1", {
        style: {
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--text)',
            letterSpacing: -.5
        }
    }, schoolName), /*#__PURE__*/ React.createElement("p", {
        style: {
            color: 'var(--text3)',
            fontSize: 13,
            marginTop: 4
        }
    }, "Management System \u2014 Karachi")), /*#__PURE__*/ React.createElement("div", {
        className: "card login-card",
        style: {
            background: 'var(--bg2)',
            border: '1px solid var(--border2)'
        }
    }, !forgotMode ? /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("h2", {
        style: {
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 20,
            color: 'var(--text)'
        }
    }, "Sign in to continue"), /*#__PURE__*/ React.createElement(Field, {
        label: "Username"
    }, /*#__PURE__*/ React.createElement("input", {
        placeholder: "Enter username",
        value: form.username,
        onChange: e => {
            setForm({
                ...form,
                username: e.target.value
            });
            setError('');
        }
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Password"
    }, /*#__PURE__*/ React.createElement("input", {
        type: "password",
        placeholder: "Enter password",
        value: form.password,
        onChange: e => {
            setForm({
                ...form,
                password: e.target.value
            });
            setError('');
        },
        onKeyDown: e => e.key === 'Enter' && handleLogin()
    })), error && /*#__PURE__*/ React.createElement("div", {
        style: {
            background: 'var(--redbg)',
            border: '1px solid rgba(248,113,113,.2)',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 12,
            color: 'var(--red)',
            marginBottom: 12
        }
    }, error), /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-primary",
        style: {
            width: '100%',
            justifyContent: 'center',
            padding: '11px',
            fontSize: 14,
            fontWeight: 600
        },
        onClick: handleLogin
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "arrow-right",
        s: 16
    }), "Sign In"), /*#__PURE__*/ React.createElement("button", {
        onClick: () => setForgotMode(true),
        style: {
            background: 'none',
            color: 'var(--text3)',
            fontSize: 12,
            width: '100%',
            marginTop: 12,
            padding: 4
        }
    }, "Forgot password?")) : !forgotSent ? /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("h2", {
        style: {
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 6,
            color: 'var(--text)'
        }
    }, "Reset Password"), /*#__PURE__*/ React.createElement("p", {
        style: {
            fontSize: 12,
            color: 'var(--text3)',
            marginBottom: 16
        }
    }, "Enter your registered email to receive reset instructions."), /*#__PURE__*/ React.createElement(Field, {
        label: "Email Address"
    }, /*#__PURE__*/ React.createElement("input", {
        type: "email",
        placeholder: "your@email.com",
        value: forgotEmail,
        onChange: e => setForgotEmail(e.target.value)
    })), /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-primary",
        style: {
            width: '100%',
            justifyContent: 'center'
        },
        onClick: () => setForgotSent(true)
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "mail",
        s: 15
    }), "Send Reset Link"), /*#__PURE__*/ React.createElement("button", {
        onClick: () => setForgotMode(false),
        style: {
            background: 'none',
            color: 'var(--text3)',
            fontSize: 12,
            width: '100%',
            marginTop: 10,
            padding: 4
        }
    }, "\u2190 Back to login")) : /*#__PURE__*/ React.createElement("div", {
        style: {
            textAlign: 'center',
            padding: '10px 0'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'var(--greenbg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            color: 'var(--green)'
        }
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "check",
        s: 22
    })), /*#__PURE__*/ React.createElement("h3", {
        style: {
            fontWeight: 600,
            marginBottom: 8,
            color: 'var(--text)'
        }
    }, "Check your email"), /*#__PURE__*/ React.createElement("p", {
        style: {
            fontSize: 12,
            color: 'var(--text3)',
            marginBottom: 16
        }
    }, "Password reset instructions sent to ", /*#__PURE__*/ React.createElement("strong", {
        style: {
            color: 'var(--text)'
        }
    }, forgotEmail)), /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-ghost",
        style: {
            width: '100%',
            justifyContent: 'center'
        },
        onClick: () => {
            setForgotMode(false);
            setForgotSent(false);
        }
    }, "Back to Login"))), /*#__PURE__*/ React.createElement("p", {
        style: {
            textAlign: 'center',
            fontSize: 11,
            color: 'var(--text3)',
            marginTop: 20
        }
    }, `\xA9 2025 ${schoolName} Management System. All rights reserved.`)));
};

// ─── Sidebar ────────────────────────────────────────────────────────────────
const Sidebar = ({
    page,
    setPage,
    user,
    schoolName,
    schoolLogo,
    sidebarOpen,
    setSidebarOpen
}) => {
    const perms = user.permissions || [];
    const menuItems = [{
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'home'
    }, {
        id: 'classes',
        label: 'Classes & Timetable',
        icon: 'exam'
    }, {
        id: 'students',
        label: 'Students',
        icon: 'student'
    }, {
        id: 'teachers',
        label: 'Teachers',
        icon: 'teacher'
    }, {
        id: 'attendance',
        label: 'Attendance',
        icon: 'attendance'
    }, {
        id: 'fees',
        label: 'Fee Management',
        icon: 'fee'
    }, {
        id: 'exams',
        label: 'Exams & Results',
        icon: 'exam'
    }, {
        id: 'inventory',
        label: 'Inventory',
        icon: 'inventory'
    }, {
        id: 'reports',
        label: 'Reports',
        icon: 'report'
    }, {
        id: 'users',
        label: 'Users & Roles',
        icon: 'users'
    }, {
        id: 'settings',
        label: 'Settings',
        icon: 'settings'
    }].filter(m => perms.includes(m.id) || m.id === 'users' && user.role === 'admin' || m.id === 'settings' && user.role === 'admin' || m.id === 'classes' && user.role === 'admin');
    const roleColors = {
        admin: 'red',
        teacher: 'blue',
        student: 'green',
        staff: 'amber',
        accountant: 'purple'
    };
    return /*#__PURE__*/ React.createElement("div", {
        className: `sidebar-wrapper${sidebarOpen ? ' open' : ''}`,
        style: {
            width: 'var(--sidebar)',
            flexShrink: 0
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            width: 'var(--sidebar)',
            height: '100vh',
            background: 'var(--bg2)',
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0,
            left: 0
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            padding: '20px 16px 16px',
            borderBottom: '1px solid var(--border)'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            alignItems: 'center',
            gap: 12
        }
    }, /*#__PURE__*/ React.createElement(SchoolMark, {
        logo: schoolLogo,
        size: 38,
        radius: 10
    }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontWeight: 700,
            fontSize: 14,
            color: 'var(--text)',
            lineHeight: 1.2
        }
    }, schoolName), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 11,
            color: 'var(--text3)',
            marginTop: 2
        }
    }, "Management System")))), /*#__PURE__*/ React.createElement("nav", {
        style: {
            flex: 1,
            overflowY: 'auto',
            padding: '10px 10px'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--text3)',
            textTransform: 'uppercase',
            letterSpacing: .8,
            padding: '6px 8px',
            marginBottom: 4
        }
    }, "Navigation"), menuItems.map(item => /*#__PURE__*/ React.createElement("div", {
        key: item.id,
        className: `sidebar-item${page === item.id ? ' active' : ''}`,
        title: item.label,
        onClick: () => {
            setPage(item.id);
            if (window.matchMedia('(max-width: 768px)').matches) {
                setSidebarOpen(false);
            }
        }
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: item.icon,
        s: 16
    }), /*#__PURE__*/ React.createElement("span", null, item.label)))), /*#__PURE__*/ React.createElement("div", {
        style: {
            padding: '14px 12px',
            borderTop: '1px solid var(--border)'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            alignItems: 'center',
            gap: 10
        }
    }, /*#__PURE__*/ React.createElement(Avatar, {
        initials: user.avatar,
        size: 32,
        color: roleColors[user.role] || 'blue',
        image: user.image
    }), /*#__PURE__*/ React.createElement("div", {
        style: {
            flex: 1,
            overflow: 'hidden'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }
    }, user.name), /*#__PURE__*/ React.createElement("span", {
        className: `badge badge-${roleColors[user.role] || 'blue'}`,
        style: {
            fontSize: 10
        }
    }, user.role))))));
};

const ProfileSettingsModal = ({
    user,
    onClose,
    onSave
}) => {
    const [form, setForm] = useState({
        ...user
    });
    const [editing, setEditing] = useState(false);
    const save = () => {
        const avatar = (form.name || '').split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();
        onSave({
            ...user,
            ...form,
            avatar
        });
        onClose();
    };
    const detail = (label, value) => /*#__PURE__*/ React.createElement("div", {
        className: "profile-detail",
        key: label
    }, /*#__PURE__*/ React.createElement("span", null, label), /*#__PURE__*/ React.createElement("strong", null, value || 'Not set'));
    return /*#__PURE__*/ React.createElement(Modal, {
        title: editing ? "Edit Profile" : "My Profile",
        onClose: onClose
    }, editing ? /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(Field, {
        label: "Profile Photo"
    }, /*#__PURE__*/ React.createElement(ImageUpload, {
        value: form.image || '',
        onChange: image => setForm({
            ...form,
            image
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Full Name"
    }, /*#__PURE__*/ React.createElement("input", {
        value: form.name || '',
        onChange: event => setForm({
            ...form,
            name: event.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Username"
    }, /*#__PURE__*/ React.createElement("input", {
        value: form.username || '',
        onChange: event => setForm({
            ...form,
            username: event.target.value
        })
    })), /*#__PURE__*/ React.createElement(Field, {
        label: "Email Address"
    }, /*#__PURE__*/ React.createElement("input", {
        type: "email",
        value: form.email || '',
        onChange: event => setForm({
            ...form,
            email: event.target.value
        })
    })), /*#__PURE__*/ React.createElement("div", {
        className: "profile-modal__actions"
    }, /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-ghost",
        onClick: () => setEditing(false)
    }, "Cancel"), /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-primary",
        onClick: save
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "check",
        s: 15
    }), "Save Changes"))) : /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("div", {
        className: "profile-modal__identity"
    }, /*#__PURE__*/ React.createElement(Avatar, {
        initials: user.avatar,
        size: 76,
        color: user.role === 'admin' ? 'red' : 'blue',
        image: user.image
    }), /*#__PURE__*/ React.createElement("div", {
        className: "profile-modal__identity-copy"
    }, /*#__PURE__*/ React.createElement("h3", null, user.name), /*#__PURE__*/ React.createElement("p", null, user.email), /*#__PURE__*/ React.createElement("div", {
        className: "profile-modal__badges"
    }, /*#__PURE__*/ React.createElement("span", {
        className: `badge badge-${user.role === 'admin' ? 'red' : 'blue'}`
    }, user.role), /*#__PURE__*/ React.createElement("span", {
        className: `badge ${user.status === 'active' ? 'badge-green' : 'badge-red'}`
    }, user.status)))), /*#__PURE__*/ React.createElement("div", {
        className: "profile-modal__details"
    }, detail('Username', user.username), detail('Email', user.email), detail('Account Status', user.status), detail('Member Since', user.joined)), /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-primary",
        onClick: () => setEditing(true)
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "edit",
        s: 15
    }), "Edit Profile")));
};

// ─── Topbar ─────────────────────────────────────────────────────────────────
const Topbar = ({
    user,
    onLogout,
    onUpdateProfile,
    notifications,
    sidebarOpen,
    setSidebarOpen
}) => {
    const [notifOpen, setNotifOpen] = useState(false);
    const [profOpen, setProfOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const unread = notifications.filter(n => !n.read).length;
    const roleColors = {
        admin: 'red',
        teacher: 'blue',
        student: 'green',
        staff: 'amber',
        accountant: 'purple'
    };
    return /*#__PURE__*/ React.createElement("div", {
        style: {
            height: 60,
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg2)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            gap: 12,
            position: 'sticky',
            top: 0,
            zIndex: 100
        }
    }, /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-ghost",
        style: {
            padding: '6px 8px',
            display: 'none'
        },
        id: "menu-btn",
        onClick: () => setSidebarOpen(!sidebarOpen)
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "menu",
        s: 18
    })), /*#__PURE__*/ React.createElement("div", {
        style: {
            flex: 1
        }
    }, /*#__PURE__*/ React.createElement("span", {
        style: {
            fontSize: 13,
            color: 'var(--text3)'
        }
    }, "Welcome back, "), /*#__PURE__*/ React.createElement("span", {
        style: {
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text)'
        }
    }, user.name.split(' ')[0])), /*#__PURE__*/ React.createElement("div", {
        style: {
            display: 'flex',
            alignItems: 'center',
            gap: 8
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            position: 'relative'
        }
    }, /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-ghost",
        style: {
            padding: '6px 8px',
            position: 'relative'
        },
        onClick: () => {
            setNotifOpen(!notifOpen);
            setProfOpen(false);
        }
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "bell",
        s: 17
    }), unread > 0 && /*#__PURE__*/ React.createElement("span", {
        style: {
            position: 'absolute',
            top: 3,
            right: 3,
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: 'var(--red)',
            fontSize: 9,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
        }
    }, unread)), notifOpen && /*#__PURE__*/ React.createElement("div", {
        style: {
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 8px)',
            width: 300,
            background: 'var(--bg2)',
            border: '1px solid var(--border2)',
            borderRadius: 12,
            boxShadow: 'var(--shadow2)',
            zIndex: 200
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            padding: '12px 16px',
            borderBottom: '1px solid var(--border)',
            fontWeight: 600,
            fontSize: 13
        }
    }, "Notifications"), notifications.map(n => /*#__PURE__*/ React.createElement("div", {
        key: n.id,
        style: {
            padding: '10px 16px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            gap: 10,
            opacity: n.read ? .7 : 1,
            cursor: 'pointer'
        },
        onClick: () => setNotifOpen(false)
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: n.type === 'warning' ? 'var(--amber)' : n.type === 'danger' ? 'var(--red)' : n.type === 'success' ? 'var(--green)' : 'var(--blue)',
            marginTop: 5,
            flexShrink: 0
        }
    }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 12,
            color: 'var(--text)',
            lineHeight: 1.4
        }
    }, n.message), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 10,
            color: 'var(--text3)',
            marginTop: 2
        }
    }, n.time)))))), /*#__PURE__*/ React.createElement("div", {
        style: {
            position: 'relative'
        }
    }, /*#__PURE__*/ React.createElement("button", {
        className: "btn btn-ghost",
        style: {
            padding: '5px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: 8
        },
        onClick: () => {
            setProfOpen(!profOpen);
            setNotifOpen(false);
        }
    }, /*#__PURE__*/ React.createElement(Avatar, {
        initials: user.avatar,
        size: 28,
        color: roleColors[user.role] || 'blue',
        image: user.image
    }), /*#__PURE__*/ React.createElement("span", {
        style: {
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--text)',
            maxWidth: 120,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        }
    }, user.name.split(' ')[0])), profOpen && /*#__PURE__*/ React.createElement("div", {
        style: {
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 8px)',
            width: 200,
            background: 'var(--bg2)',
            border: '1px solid var(--border2)',
            borderRadius: 12,
            boxShadow: 'var(--shadow2)',
            zIndex: 200
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            padding: '14px 16px',
            borderBottom: '1px solid var(--border)'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        style: {
            fontWeight: 600,
            fontSize: 13,
            color: 'var(--text)'
        }
    }, user.name), /*#__PURE__*/ React.createElement("div", {
        style: {
            fontSize: 11,
            color: 'var(--text3)'
        }
    }, user.email), /*#__PURE__*/ React.createElement("span", {
        className: `badge badge-${roleColors[user.role] || 'blue'}`,
        style: {
            marginTop: 6
        }
    }, user.role)), /*#__PURE__*/ React.createElement("div", {
        style: {
            padding: '8px'
        }
    }, /*#__PURE__*/ React.createElement("div", {
        className: "sidebar-item",
        style: {
            padding: '8px 10px'
        },
        onClick: () => {
            setProfOpen(false);
            setProfileOpen(true);
        }
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "settings",
        s: 14
    }), "Profile Settings"), /*#__PURE__*/ React.createElement("div", {
        className: "sidebar-item",
        style: {
            padding: '8px 10px',
            color: 'var(--red)'
        },
        onClick: onLogout
    }, /*#__PURE__*/ React.createElement(Icon, {
        n: "logout",
        s: 14
    }), "Sign Out"))), profileOpen && /*#__PURE__*/ React.createElement(ProfileSettingsModal, {
        user: user,
        onClose: () => setProfileOpen(false),
        onSave: onUpdateProfile
    }))));
};

// ─── App ───────────────────────────────────────────────────────────────────
function App() {
    const [users, setUsers] = useState([]);
    const [schoolName, setSchoolName] = useState('Smart School');
    const [schoolLogo, setSchoolLogo] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [page, setPage] = useState('dashboard');
    const [toast, setToast] = useState(null);
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [timetable, setTimetable] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [fees, setFees] = useState([]);
    const [payments, setPayments] = useState([]);
    const [exams, setExams] = useState([]);
    const [results, setResults] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [databaseReady, setDatabaseReady] = useState(false);
    const [databaseError, setDatabaseError] = useState('');
    const saveQueue = useRef(Promise.resolve());
    useEffect(() => {
        let active = true;
        fetch('/api/data').then(response => {
            if (!response.ok) throw new Error(`Database request failed (${response.status})`);
            return response.json();
        }).then(({ data }) => {
            if (!active) return;
            const loadedUsers = data && Array.isArray(data.users) ? data.users : [];
            setUsers(loadedUsers);
            const savedUserId = localStorage.getItem('schoolManagementUserId');
            const savedUser = loadedUsers.find(user => String(user.id) === savedUserId && user.status !== 'inactive');
            if (savedUser) {
                setCurrentUser(savedUser);
            } else {
                localStorage.removeItem('schoolManagementUserId');
            }
            if (data) {
                setSchoolName(data.schoolName || 'Smart School');
                setSchoolLogo(data.schoolLogo || '');
                setStudents(data.students || []);
                setTeachers(data.teachers || []);
                setClasses(data.classes || []);
                setTimetable(data.timetable || []);
                setAttendance(data.attendance || []);
                setFees(data.fees || []);
                setPayments(data.payments || []);
                setExams(data.exams || []);
                setResults(data.results || []);
                setInventory(data.inventory || []);
                setNotifications(data.notifications || []);
            }
            setDatabaseReady(true);
        }).catch(error => {
            if (!active) return;
            setDatabaseError(error.message);
            setDatabaseReady(true);
        });
        return () => {
            active = false;
        };
    }, []);
    useEffect(() => {
        if (!databaseReady || databaseError) return;
        const data = { users, schoolName, schoolLogo, students, teachers, classes, timetable, attendance, fees, payments, exams, results, inventory, notifications };
        saveQueue.current = saveQueue.current.then(() => fetch('/api/data', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })).then(response => {
            if (!response.ok) throw new Error(`Database save failed (${response.status})`);
        }).catch(error => {
            setDatabaseError(error.message);
        });
    }, [databaseReady, databaseError, users, schoolName, schoolLogo, students, teachers, classes, timetable, attendance, fees, payments, exams, results, inventory, notifications]);
    useEffect(() => {
        document.title = `${schoolName} Management System`;
    }, [schoolName]);
    useEffect(() => {
        document.querySelectorAll('.main-content main table').forEach(table => {
            const labels = Array.from(table.querySelectorAll('thead th'), header => header.textContent.trim());
            table.querySelectorAll('tbody tr').forEach(row => {
                Array.from(row.cells).forEach((cell, index) => {
                    if (labels[index]) cell.dataset.label = labels[index];
                });
            });
        });
    }, [currentUser, page, students, teachers, attendance, fees, exams, results, inventory, users]);
    const showToast = (msg, type = 'info') => setToast({
        msg,
        type
    });
    const updateSchoolName = value => {
        const updatedName = value.trim() || 'Smart School';
        setSchoolName(updatedName);
    };
    const updateSchoolLogo = value => setSchoolLogo(value);
    const updateProfile = updatedUser => {
        setUsers(previousUsers => previousUsers.map(user => user.id === updatedUser.id ? {
            ...user,
            ...updatedUser
        } : user));
        setCurrentUser(previousUser => previousUser && previousUser.id === updatedUser.id ? {
            ...previousUser,
            ...updatedUser
        } : previousUser);
        showToast('Profile updated successfully', 'success');
    };
    const login = user => {
        setCurrentUser(user);
        localStorage.setItem('schoolManagementUserId', String(user.id));
        localStorage.setItem('schoolManagementLastUsername', user.username);
        setPage('dashboard');
    };
    const createFirstAdmin = details => {
        if (users.length) return;
        const user = {
            ...details,
            id: Date.now(),
            role: 'admin',
            status: 'active',
            avatar: details.name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase(),
            joined: new Date().toISOString().split('T')[0],
            permissions: PERMISSIONS
        };
        setUsers([user]);
        login(user);
    };
    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('schoolManagementUserId');
        setPage('dashboard');
    };
    const hasPerm = p => currentUser && ((currentUser.permissions || []).includes(p) || currentUser.role === 'admin');
    const canEdit = p => hasPerm(p);
    const canAdd = p => hasPerm(p);
    const canDelete = p => Boolean(currentUser && currentUser.role === 'admin');
    if (!databaseReady) {
        return /*#__PURE__*/ React.createElement("div", {
            style: { minHeight: '100vh', display: 'grid', placeItems: 'center', color: 'var(--text2)' }
        }, "Connecting to local database...");
    }
    if (databaseError) {
        return /*#__PURE__*/ React.createElement("div", {
            style: { minHeight: '100vh', display: 'grid', placeItems: 'center', color: 'var(--red)' }
        }, `Local database unavailable: ${databaseError}. Start the app with npm start.`);
    }
    if (!currentUser) {
        return /*#__PURE__*/ React.createElement(React.Fragment, null, users.length === 0 ? /*#__PURE__*/ React.createElement(FirstAdminSetup, {
            onCreate: createFirstAdmin,
            schoolName: schoolName,
            schoolLogo: schoolLogo
        }) : /*#__PURE__*/ React.createElement(Login, {
            onLogin: login,
            users: users,
            schoolName: schoolName,
            schoolLogo: schoolLogo
        }), toast && /*#__PURE__*/ React.createElement(Toast, {
            msg: toast.msg,
            type: toast.type,
            onClose: () => setToast(null)
        }));
    }
    const pageComponents = {
        dashboard: /*#__PURE__*/ React.createElement(Dashboard, {
            students: students,
            teachers: teachers,
            fees: fees,
            attendance: attendance,
            notifications: notifications,
            schoolName: schoolName
        }),
        classes: currentUser.role === 'admin' ? /*#__PURE__*/ React.createElement(Classes, {
            classes: classes.map(item => ({...item, studentCount: students.filter(student => String(student.class) === String(item.name) && String(student.section) === String(item.section)).length })),
            setClasses: setClasses,
            timetable: timetable,
            setTimetable: setTimetable,
            teachers: teachers,
            toast: showToast
        }) : /*#__PURE__*/ React.createElement(AccessDenied, null),
        students: hasPerm('students') ? /*#__PURE__*/ React.createElement(Students, {
            students: students,
            setStudents: setStudents,
            classes: classes,
            toast: showToast,
            canEdit: canEdit('students'),
            canAdd: canAdd('students'),
            canDelete: canDelete('students')
        }) : /*#__PURE__*/ React.createElement(AccessDenied, null),
        teachers: hasPerm('teachers') ? /*#__PURE__*/ React.createElement(Teachers, {
            teachers: teachers,
            setTeachers: setTeachers,
            toast: showToast,
            canEdit: canEdit('teachers'),
            canAdd: canAdd('teachers'),
            canDelete: canDelete('teachers')
        }) : /*#__PURE__*/ React.createElement(AccessDenied, null),
        attendance: hasPerm('attendance') ? /*#__PURE__*/ React.createElement(Attendance, {
            attendance: attendance,
            setAttendance: setAttendance,
            students: students,
            classes: classes,
            toast: showToast,
            canEdit: canEdit('attendance')
        }) : /*#__PURE__*/ React.createElement(AccessDenied, null),
        fees: hasPerm('fees') ? /*#__PURE__*/ React.createElement(FeesDesk, {
            fees: fees,
            setFees: setFees,
            payments: payments,
            setPayments: setPayments,
            students: students,
            setStudents: setStudents,
            classes: classes,
            toast: showToast,
            canEdit: canEdit('fees'),
            canAdd: canAdd('fees')
        }) : /*#__PURE__*/ React.createElement(AccessDenied, null),
        exams: hasPerm('exams') ? /*#__PURE__*/ React.createElement(Exams, {
            exams: exams,
            setExams: setExams,
            students: students,
            results: results,
            setResults: setResults,
            toast: showToast,
            canEdit: canEdit('exams'),
            canAdd: canAdd('exams')
        }) : /*#__PURE__*/ React.createElement(AccessDenied, null),
        inventory: hasPerm('inventory') ? /*#__PURE__*/ React.createElement(Inventory, {
            inventory: inventory,
            setInventory: setInventory,
            toast: showToast,
            canEdit: canEdit('inventory'),
            canAdd: canAdd('inventory'),
            canDelete: canDelete('inventory')
        }) : /*#__PURE__*/ React.createElement(AccessDenied, null),
        reports: hasPerm('reports') ? /*#__PURE__*/ React.createElement(Reports, {
            students: students,
            fees: fees,
            attendance: attendance,
            exams: exams,
            results: results
        }) : /*#__PURE__*/ React.createElement(AccessDenied, null),
        users: currentUser.role === 'admin' ? /*#__PURE__*/ React.createElement(Users, {
            users: users,
            setUsers: setUsers,
            toast: showToast
        }) : /*#__PURE__*/ React.createElement(AccessDenied, null),
        settings: currentUser.role === 'admin' ? /*#__PURE__*/ React.createElement(Settings, {
            user: currentUser,
            toast: showToast,
            schoolName: schoolName,
            schoolLogo: schoolLogo,
            onSaveSchoolName: updateSchoolName,
            onSaveSchoolLogo: updateSchoolLogo
        }) : /*#__PURE__*/ React.createElement(AccessDenied, null)
    };
    return /*#__PURE__*/ React.createElement("div", {
        className: "app-shell",
        style: {
            display: 'flex',
            minHeight: '100vh'
        }
    }, /*#__PURE__*/ React.createElement(Sidebar, {
        page: page,
        setPage: setPage,
        user: currentUser,
        schoolName: schoolName,
        schoolLogo: schoolLogo,
        sidebarOpen: sidebarOpen,
        setSidebarOpen: setSidebarOpen
    }), sidebarOpen && /*#__PURE__*/ React.createElement("div", {
        className: "sidebar-overlay",
        onClick: () => setSidebarOpen(false),
        style: {
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.5)',
            zIndex: 150
        }
    }), /*#__PURE__*/ React.createElement("div", {
        className: "main-content",
        style: {
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column'
        }
    }, /*#__PURE__*/ React.createElement(Topbar, {
        user: currentUser,
        onLogout: logout,
        onUpdateProfile: updateProfile,
        notifications: notifications,
        sidebarOpen: sidebarOpen,
        setSidebarOpen: setSidebarOpen
    }), /*#__PURE__*/ React.createElement("main", {
        style: {
            flex: 1,
            padding: '24px 24px',
            background: 'var(--bg)',
            overflowX: 'auto'
        }
    }, pageComponents[page] || /*#__PURE__*/ React.createElement(Dashboard, {
        students: students,
        teachers: teachers,
        fees: fees,
        attendance: attendance,
        notifications: notifications
    }))), toast && /*#__PURE__*/ React.createElement(Toast, {
        msg: toast.msg,
        type: toast.type,
        onClose: () => setToast(null)
    }));
}
const AccessDenied = () => /*#__PURE__*/ React.createElement("div", {
    style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300,
        gap: 12,
        color: 'var(--text3)'
    }
}, /*#__PURE__*/ React.createElement(Icon, {
    n: "lock",
    s: 40
}), /*#__PURE__*/ React.createElement("div", {
    style: {
        fontSize: 16,
        fontWeight: 600,
        color: 'var(--text)'
    }
}, "Access Denied"), /*#__PURE__*/ React.createElement("div", {
    style: {
        fontSize: 13
    }
}, "You don't have permission to access this module."));
ReactDOM.createRoot(document.getElementById('root')).render( /*#__PURE__*/ React.createElement(App, null));