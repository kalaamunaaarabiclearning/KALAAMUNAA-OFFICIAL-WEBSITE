import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { 
  Course, 
  Order, 
  OrderStatus, 
  User, 
  StudentProgress, 
  Testimonial, 
  AdminPost, 
  CartItem, 
  HeroContent, 
  FeaturesContent 
} from '../types';
import { 
  INITIAL_COURSES, 
  INITIAL_TESTIMONIALS, 
  INITIAL_POSTS, 
  INITIAL_USERS, 
  ADMIN_CREDENTIALS, 
  INITIAL_HERO_CONTENT, 
  INITIAL_FEATURES_CONTENT 
} from '../data/initialData';

const STORAGE_KEYS = {
  COURSES: 'kalaamunaa_courses',
  ORDERS: 'kalaamunaa_orders',
  USERS: 'kalaamunaa_users',
  CURRENT_USER: 'kalaamunaa_current_user',
  CART: 'kalaamunaa_cart',
  PROGRESS: 'kalaamunaa_progress',
  TESTIMONIALS: 'kalaamunaa_testimonials',
  POSTS: 'kalaamunaa_posts',
  HERO_CONTENT: 'kalaamunaa_hero_content',
  FEATURES_CONTENT: 'kalaamunaa_features_content',
};

// Event emitter for real-time Firestore updates across the application
type Listener = () => void;
const changeListeners = new Set<Listener>();

export function subscribeToDataChanges(listener: Listener): () => void {
  changeListeners.add(listener);
  return () => {
    changeListeners.delete(listener);
  };
}

function notifyDataChanged() {
  changeListeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error('Error notifying data change:', e);
    }
  });
}

let isFirestoreInitialized = false;

// Initialize default state & connect live Firestore syncing
export function initializeStorage() {
  // 1. Initial LocalStorage fallback setup
  if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TESTIMONIALS)) {
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(INITIAL_TESTIMONIALS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.HERO_CONTENT)) {
    localStorage.setItem(STORAGE_KEYS.HERO_CONTENT, JSON.stringify(INITIAL_HERO_CONTENT));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FEATURES_CONTENT)) {
    localStorage.setItem(STORAGE_KEYS.FEATURES_CONTENT, JSON.stringify(INITIAL_FEATURES_CONTENT));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    const sampleOrders: Order[] = [
      {
        id: 'ord-1001',
        studentId: 'user-student-demo',
        studentName: 'Ahmad Fauzan',
        studentEmail: 'ahmad.fauzan@gmail.com',
        studentPhone: '081298765432',
        items: [
          {
            courseId: 'course-nahwu-dasar',
            title: 'Nahwu Kilat Dasar: Memahami Struktur Kalimat Arab & Al-Qur\'an',
            price: 199000,
          },
        ],
        totalPrice: 199000,
        status: 'approved',
        createdAt: '2026-03-10T10:00:00.000Z',
        approvedAt: '2026-03-10T10:15:00.000Z',
      },
      {
        id: 'ord-1002',
        studentId: 'user-student-demo',
        studentName: 'Ahmad Fauzan',
        studentEmail: 'ahmad.fauzan@gmail.com',
        studentPhone: '081298765432',
        items: [
          {
            courseId: 'course-muhadatsah-sehari-hari',
            title: 'Muhadatsah Praktis: Percakapan Bahasa Arab Sehari-hari',
            price: 179000,
          },
        ],
        totalPrice: 179000,
        status: 'pending',
        createdAt: '2026-04-10T09:30:00.000Z',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(sampleOrders));
  }

  if (!localStorage.getItem(STORAGE_KEYS.PROGRESS)) {
    const sampleProgress: Record<string, StudentProgress> = {
      'user-student-demo_course-nahwu-dasar': {
        studentId: 'user-student-demo',
        courseId: 'course-nahwu-dasar',
        watchedLessonIds: ['lesson-1-1'],
        completedQuizIds: ['lesson-1-1'],
        completedLessonIds: ['lesson-1-1'],
        currentLessonId: 'lesson-1-2',
        isCertificateRequested: false,
      },
    };
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(sampleProgress));
  }

  // 2. Initialize Firestore Live Syncing (once)
  if (isFirestoreInitialized) return;
  isFirestoreInitialized = true;

  try {
    // --- COURSES SYNC ---
    const coursesPath = 'courses';
    onSnapshot(collection(db, coursesPath), (snapshot) => {
      if (snapshot.empty) {
        // Seed initial courses to Firebase Firestore
        INITIAL_COURSES.forEach(async (course) => {
          try {
            await setDoc(doc(db, coursesPath, course.id), course);
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, `${coursesPath}/${course.id}`);
          }
        });
      } else {
        const loaded: Course[] = [];
        snapshot.forEach((d) => loaded.push(d.data() as Course));
        localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(loaded));
        notifyDataChanged();
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, coursesPath);
    });

    // --- ORDERS SYNC ---
    const ordersPath = 'orders';
    onSnapshot(collection(db, ordersPath), (snapshot) => {
      if (snapshot.empty) {
        const initialOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
        initialOrders.forEach(async (order: Order) => {
          try {
            await setDoc(doc(db, ordersPath, order.id), order);
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, `${ordersPath}/${order.id}`);
          }
        });
      } else {
        const loaded: Order[] = [];
        snapshot.forEach((d) => loaded.push(d.data() as Order));
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(loaded));
        notifyDataChanged();
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, ordersPath);
    });

    // --- USERS SYNC ---
    const usersPath = 'users';
    onSnapshot(collection(db, usersPath), (snapshot) => {
      if (snapshot.empty) {
        INITIAL_USERS.forEach(async (user) => {
          try {
            await setDoc(doc(db, usersPath, user.id), user);
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, `${usersPath}/${user.id}`);
          }
        });
      } else {
        const loaded: User[] = [];
        const passwordsMap = JSON.parse(localStorage.getItem('kalaamunaa_passwords') || '{}');
        snapshot.forEach((d) => {
          const u = d.data() as User;
          loaded.push(u);
          if (u.password) {
            passwordsMap[u.email.toLowerCase()] = u.password;
            passwordsMap[u.name.toLowerCase()] = u.password;
          }
        });
        localStorage.setItem('kalaamunaa_passwords', JSON.stringify(passwordsMap));
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(loaded));
        notifyDataChanged();
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, usersPath);
    });

    // --- TESTIMONIALS SYNC ---
    const testimonialsPath = 'testimonials';
    onSnapshot(collection(db, testimonialsPath), (snapshot) => {
      if (snapshot.empty) {
        INITIAL_TESTIMONIALS.forEach(async (item) => {
          try {
            await setDoc(doc(db, testimonialsPath, item.id), item);
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, `${testimonialsPath}/${item.id}`);
          }
        });
      } else {
        const loaded: Testimonial[] = [];
        snapshot.forEach((d) => loaded.push(d.data() as Testimonial));
        localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(loaded));
        notifyDataChanged();
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, testimonialsPath);
    });

    // --- POSTS SYNC ---
    const postsPath = 'posts';
    onSnapshot(collection(db, postsPath), (snapshot) => {
      if (snapshot.empty) {
        INITIAL_POSTS.forEach(async (item) => {
          try {
            await setDoc(doc(db, postsPath, item.id), item);
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, `${postsPath}/${item.id}`);
          }
        });
      } else {
        const loaded: AdminPost[] = [];
        snapshot.forEach((d) => loaded.push(d.data() as AdminPost));
        localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(loaded));
        notifyDataChanged();
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, postsPath);
    });

    // --- SETTINGS (HERO & FEATURES) SYNC ---
    const settingsPath = 'settings';
    onSnapshot(collection(db, settingsPath), (snapshot) => {
      if (snapshot.empty) {
        setDoc(doc(db, settingsPath, 'hero'), { ...INITIAL_HERO_CONTENT }).catch(console.error);
        setDoc(doc(db, settingsPath, 'features'), { ...INITIAL_FEATURES_CONTENT }).catch(console.error);
      } else {
        snapshot.forEach((docItem) => {
          if (docItem.id === 'hero') {
            localStorage.setItem(STORAGE_KEYS.HERO_CONTENT, JSON.stringify(docItem.data()));
          } else if (docItem.id === 'features') {
            localStorage.setItem(STORAGE_KEYS.FEATURES_CONTENT, JSON.stringify(docItem.data()));
          }
        });
        notifyDataChanged();
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, settingsPath);
    });
  } catch (err) {
    console.error('Firestore initialization error:', err);
  }
}

// ---------------- COURSES ----------------
export function getCourses(): Course[] {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.COURSES);
  return data ? JSON.parse(data) : INITIAL_COURSES;
}

export function saveCourses(courses: Course[]) {
  localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  notifyDataChanged();

  // Async write to Firebase Firestore
  courses.forEach(async (course) => {
    try {
      await setDoc(doc(db, 'courses', course.id), course);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `courses/${course.id}`);
    }
  });
}

export function getCourseById(id: string): Course | undefined {
  const courses = getCourses();
  return courses.find((c) => c.id === id);
}

// ---------------- USERS & AUTH ----------------
export function getUsers(): User[] {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : INITIAL_USERS;
}

export function saveUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  notifyDataChanged();

  // Async write to Firebase Firestore
  users.forEach(async (user) => {
    try {
      await setDoc(doc(db, 'users', user.id), user);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.id}`);
    }
  });
}

export function getCurrentUser(): User | null {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export function loginTeacher(usernameInput: string, passwordInput: string): { success: boolean; user?: User; message?: string } {
  const cleanUser = usernameInput.trim();
  const cleanPass = passwordInput.trim();

  // Match username or email as Guru
  const isMatch = (cleanUser.toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase() ||
                   cleanUser.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase()) &&
                  cleanPass === ADMIN_CREDENTIALS.password;

  if (isMatch) {
    const adminUser: User = {
      id: 'user-admin',
      name: 'Mudarris Kalaamunaa',
      email: ADMIN_CREDENTIALS.email,
      role: 'teacher',
      phone: '082311776535',
      createdAt: '2026-01-01T00:00:00.000Z',
    };
    setCurrentUser(adminUser);
    return { success: true, user: adminUser };
  }
  return { success: false, message: 'Username atau password Guru salah. Silakan periksa kembali.' };
}

export function loginStudent(identityInput: string, passwordInput: string): { success: boolean; user?: User; message?: string } {
  const users = getUsers();
  const cleanInput = identityInput.trim().toLowerCase();
  const cleanPass = passwordInput.trim();

  if (!cleanInput) {
    return { success: false, message: 'Silakan masukkan email atau username Anda.' };
  }

  // Find user by email, name/username, or phone number
  const user = users.find((u) => {
    const emailMatch = Boolean(u.email && u.email.toLowerCase() === cleanInput);
    const nameMatch = Boolean(u.name && u.name.toLowerCase() === cleanInput);
    const phoneMatch = Boolean(u.phone && cleanInput.length >= 8 && u.phone.replace(/[^0-9]/g, '') === cleanInput.replace(/[^0-9]/g, ''));
    return emailMatch || nameMatch || phoneMatch;
  });
  
  if (!user) {
    return { success: false, message: 'Akun dengan email atau username tersebut tidak ditemukan. Silakan periksa kembali atau daftar akun baru.' };
  }

  // Stored password check via user.password, localStorage passwordsMap, or demo default
  const passwordsMap = JSON.parse(localStorage.getItem('kalaamunaa_passwords') || '{}');
  const storedPassword = user.password || 
                         passwordsMap[user.email.toLowerCase()] || 
                         passwordsMap[user.name.toLowerCase()] || 
                         (user.id === 'user-student-demo' ? 'password123' : '');

  if (!storedPassword || storedPassword !== cleanPass) {
    return { success: false, message: 'Password salah. Silakan coba lagi atau klik ikon mata untuk melihat password.' };
  }

  setCurrentUser(user);
  return { success: true, user };
}

export function registerStudent(name: string, email: string, password: string, phone: string = ''): { success: boolean; user?: User; message?: string } {
  const users = getUsers();
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();
  const cleanPass = password.trim();

  const existingEmail = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existingEmail) {
    return { success: false, message: 'Email ini sudah terdaftar. Silakan masuk (login).' };
  }

  const newUser: User = {
    id: 'user-' + Date.now(),
    name: cleanName,
    email: cleanEmail,
    phone: phone.trim(),
    role: 'student',
    password: cleanPass,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  // Save password in map under both email and name/username
  const passwordsMap = JSON.parse(localStorage.getItem('kalaamunaa_passwords') || '{}');
  passwordsMap[newUser.email.toLowerCase()] = cleanPass;
  passwordsMap[newUser.name.toLowerCase()] = cleanPass;
  localStorage.setItem('kalaamunaa_passwords', JSON.stringify(passwordsMap));

  setCurrentUser(newUser);
  return { success: true, user: newUser };
}

// ---------------- CART ----------------
export function getCart(): CartItem[] {
  const data = localStorage.getItem(STORAGE_KEYS.CART);
  return data ? JSON.parse(data) : [];
}

export function addToCart(course: Course): { added: boolean; message: string } {
  const cart = getCart();
  if (cart.some((item) => item.courseId === course.id)) {
    return { added: false, message: 'Kursus ini sudah ada di keranjang Anda.' };
  }
  cart.push({
    courseId: course.id,
    title: course.title,
    arabicTitle: course.arabicTitle,
    price: course.price,
    thumbnail: course.thumbnail,
  });
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  return { added: true, message: 'Kursus berhasil ditambahkan ke keranjang.' };
}

export function removeFromCart(courseId: string) {
  const cart = getCart().filter((item) => item.courseId !== courseId);
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
}

export function clearCart() {
  localStorage.removeItem(STORAGE_KEYS.CART);
}

// ---------------- ORDERS & APPROVAL ----------------
export function getOrders(): Order[] {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return data ? JSON.parse(data) : [];
}

export function saveOrders(orders: Order[]) {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  notifyDataChanged();

  // Async write to Firebase Firestore
  orders.forEach(async (order) => {
    try {
      await setDoc(doc(db, 'orders', order.id), order);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `orders/${order.id}`);
    }
  });
}

export function createOrder(student: User, cartItems: CartItem[]): Order {
  const orders = getOrders();
  const total = cartItems.reduce((acc, curr) => acc + curr.price, 0);

  const newOrder: Order = {
    id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
    studentId: student.id,
    studentName: student.name,
    studentEmail: student.email,
    studentPhone: student.phone || '',
    items: cartItems.map((c) => ({
      courseId: c.courseId,
      title: c.title,
      price: c.price,
    })),
    totalPrice: total,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  orders.unshift(newOrder);
  saveOrders(orders);
  clearCart();
  return newOrder;
}

export function approveOrder(orderId: string): boolean {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx !== -1) {
    orders[idx].status = 'approved';
    orders[idx].approvedAt = new Date().toISOString();
    saveOrders(orders);
    return true;
  }
  return false;
}

export function rejectOrder(orderId: string): boolean {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx !== -1) {
    orders[idx].status = 'rejected';
    saveOrders(orders);
    return true;
  }
  return false;
}

export function checkCourseAccess(studentId: string, courseId: string, userRole?: string): { hasAccess: boolean; orderStatus?: OrderStatus } {
  // Teachers/Admins have access to all courses
  if (userRole === 'teacher' || userRole === 'admin') {
    return { hasAccess: true, orderStatus: 'approved' };
  }

  const orders = getOrders();
  const userOrders = orders.filter((o) => o.studentId === studentId);

  // Check if approved order exists for this course
  for (const ord of userOrders) {
    const hasItem = ord.items.some((item) => item.courseId === courseId);
    if (hasItem) {
      if (ord.status === 'approved') {
        return { hasAccess: true, orderStatus: 'approved' };
      }
      if (ord.status === 'pending') {
        return { hasAccess: false, orderStatus: 'pending' };
      }
    }
  }

  return { hasAccess: false, orderStatus: undefined };
}

// ---------------- STUDENT PROGRESS ----------------
export function getStudentProgress(studentId: string, courseId: string): StudentProgress {
  initializeStorage();
  const allProgress = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS) || '{}');
  const key = `${studentId}_${courseId}`;
  if (allProgress[key]) {
    return allProgress[key];
  }
  return {
    studentId,
    courseId,
    watchedLessonIds: [],
    completedQuizIds: [],
    completedLessonIds: [],
    isCertificateRequested: false,
  };
}

export function saveStudentProgress(progress: StudentProgress) {
  const allProgress = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS) || '{}');
  const key = `${progress.studentId}_${progress.courseId}`;
  allProgress[key] = progress;
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));

  // Async write to Firebase
  setDoc(doc(db, 'progress', key), progress).catch((err) => {
    console.error('Failed to save progress to Firestore:', err);
  });
}

// ---------------- TESTIMONIALS & POSTS ----------------
export function getTestimonials(): Testimonial[] {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
  return data ? JSON.parse(data) : INITIAL_TESTIMONIALS;
}

export function saveTestimonials(testimonials: Testimonial[]) {
  localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
  notifyDataChanged();

  testimonials.forEach(async (t) => {
    try {
      await setDoc(doc(db, 'testimonials', t.id), t);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `testimonials/${t.id}`);
    }
  });
}

export function getPosts(): AdminPost[] {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.POSTS);
  return data ? JSON.parse(data) : INITIAL_POSTS;
}

export function savePosts(posts: AdminPost[]) {
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  notifyDataChanged();

  posts.forEach(async (p) => {
    try {
      await setDoc(doc(db, 'posts', p.id), p);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `posts/${p.id}`);
    }
  });
}

// ---------------- HELPERS ----------------
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Extracts clean embed URL from various YouTube formats
export function getYoutubeEmbedUrl(url: string): string {
  if (!url) return '';
  if (url.includes('/embed/')) return url;

  let videoId = '';
  // youtu.be/VIDEO_ID
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
  }
  // youtube.com/watch?v=VIDEO_ID
  else if (url.includes('watch?v=')) {
    videoId = url.split('watch?v=')[1]?.split('&')[0] || '';
  }
  // just the 11 character ID
  else if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    videoId = url;
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  }
  return url;
}

export const getYouTubeEmbedUrl = getYoutubeEmbedUrl;


// WhatsApp link generator matching exact user requirement:
export function generateWhatsAppOrderUrl(studentName: string, items: { title: string; price: number }[], totalPrice: number): string {
  const phoneNumber = '6282311776535';
  
  const courseListText = items
    .map((item) => `[${item.title} x ${formatRupiah(item.price)}]`)
    .join(', ');

  const message = `Assalamualaikum Admin Kalaamunaa,\nSaya ${studentName} ingin mengikuti kursus ${courseListText}. Total ${formatRupiah(totalPrice)}`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

export function getHeroContent(): HeroContent {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.HERO_CONTENT);
  return data ? JSON.parse(data) : INITIAL_HERO_CONTENT;
}

export function saveHeroContent(content: HeroContent): void {
  localStorage.setItem(STORAGE_KEYS.HERO_CONTENT, JSON.stringify(content));
  notifyDataChanged();

  // Async write to Firebase settings
  try {
    setDoc(doc(db, 'settings', 'hero'), content).catch((err) => {
      handleFirestoreError(err, OperationType.WRITE, 'settings/hero');
    });
  } catch (err) {
    console.error('Error saving hero to Firestore:', err);
  }
}

export function getFeaturesContent(): FeaturesContent {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.FEATURES_CONTENT);
  return data ? JSON.parse(data) : INITIAL_FEATURES_CONTENT;
}

export function saveFeaturesContent(content: FeaturesContent): void {
  localStorage.setItem(STORAGE_KEYS.FEATURES_CONTENT, JSON.stringify(content));
  notifyDataChanged();

  // Async write to Firebase settings
  try {
    setDoc(doc(db, 'settings', 'features'), content).catch((err) => {
      handleFirestoreError(err, OperationType.WRITE, 'settings/features');
    });
  } catch (err) {
    console.error('Error saving features to Firestore:', err);
  }
}
