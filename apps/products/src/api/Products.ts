interface Product {
  sku: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  detail: string;
  features: string[];
  billing: 'monthly' | 'deposit';
}
interface Products {
  getAllProducts(): Product[];
}
const products: Product[] = [
  {
    sku: 'PAY-START',
    name: 'Payroll Starter',
    description:
      'Less admin, more time for your team. A simple payroll subscription for small businesses.',
    price: 999,
    category: 'For business',
    image:
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85',
    detail: 'Up to 10 employees',
    billing: 'monthly',
    features: [
      'One scheduled payroll run each month',
      'Digital payslips for every employee',
      'CSV employee import',
      'Email assistance',
    ],
  },
  {
    sku: 'PAY-GROW',
    name: 'Payroll Growth',
    description:
      'A little more flexibility for a growing team, with approvals that keep everyone aligned.',
    price: 2499,
    category: 'For business',
    image:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85',
    detail: 'Up to 50 employees',
    billing: 'monthly',
    features: [
      'Unlimited scheduled payroll runs',
      'Two-step payroll approvals',
      'Digital payslips and payroll reports',
      'Priority email assistance',
    ],
  },
  {
    sku: 'PAY-SCALE',
    name: 'Payroll Scale',
    description:
      'Bring larger teams and multiple locations together in one clear payroll workspace.',
    price: 5999,
    category: 'For business',
    image:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85',
    detail: 'Up to 200 employees',
    billing: 'monthly',
    features: [
      'Everything in Payroll Growth',
      'Multiple branches and departments',
      'Custom reporting exports',
      'Dedicated onboarding session',
    ],
  },
  {
    sku: 'DEBIT-EVERY',
    name: 'Everyday Debit',
    description:
      'Your everyday spending companion. Start with a small deposit and keep your money within reach.',
    price: 500,
    category: 'For you',
    image:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=85',
    detail: 'PHP 500 opening deposit',
    billing: 'deposit',
    features: [
      'Debit card for everyday purchases',
      'Online account access',
      'Spending notifications',
      'Opening deposit becomes your balance',
    ],
  },
  {
    sku: 'DEBIT-STUDENT',
    name: 'Student Debit',
    description:
      'Make your first money moves with a straightforward account for campus life and beyond.',
    price: 100,
    category: 'For you',
    image:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=85',
    detail: 'PHP 100 opening deposit',
    billing: 'deposit',
    features: [
      'Low opening deposit',
      'Debit card for daily essentials',
      'Simple spending overview',
      'For students aged 18 and above',
    ],
  },
  {
    sku: 'DEBIT-PLUS',
    name: 'Everyday Plus Debit',
    description:
      'Create a little more breathing room for daily spending and the plans taking shape.',
    price: 2500,
    category: 'For you',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',
    detail: 'PHP 2,500 opening deposit',
    billing: 'deposit',
    features: [
      'Everything in Everyday Debit',
      'Separate savings goals',
      'Monthly spending insights',
      'Opening deposit becomes your balance',
    ],
  },
];
export const ProductsAPI: Products = {
  getAllProducts(): Product[] {
    return products;
  },
};
