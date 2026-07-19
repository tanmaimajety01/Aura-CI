// Fast Seedable Pseudo-Random Number Generator (Mulberry32)
function createRandom(seed: number) {
  let s = seed;
  return function() {
    let t = (s += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Non-binary';
  region: 'North India' | 'South India' | 'East India' | 'West India' | 'North America' | 'Europe' | 'Asia Pacific';
  device: 'Mobile' | 'Desktop' | 'Tablet';
  paymentMethod: 'Credit Card' | 'PayPal' | 'Bank Transfer' | 'UPI';
  salesChannel: 'Online' | 'Direct' | 'Partner' | 'Referral';
  tenure: number; // in months
  subscriptionPlan: 'Basic' | 'Pro' | 'Premium' | 'Enterprise';
  csat: number; // 1 to 5
  supportTickets: number; // 0 to 15
  lastPurchaseDaysAgo: number; // 1 to 365
  productsPurchased: string[];
  campaignResponse: 'Responded' | 'Ignored' | 'Unsubscribed';
  predictedChurnProb: number; // 0.0 to 1.0
  churnPredicted: number; // 0 or 1
  clv: number; // Customer Lifetime Value
  monthlyRevenue: number;
}

const FIRST_NAMES = [
  'Aarav', 'Ananya', 'Amit', 'Divya', 'Rahul', 'Priya', 'Aditya', 'Sneha', 'Vikram', 'Rohan',
  'Keerthi', 'Sanjay', 'Neha', 'Arjun', 'Pooja', 'John', 'Sarah', 'Michael', 'Emily', 'David',
  'Jessica', 'James', 'Emma', 'Robert', 'Sophia', 'William', 'Isabella', 'Richard', 'Olivia'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Reddy', 'Patel', 'Kumar', 'Singh', 'Nair', 'Joshi', 'Rao', 'Gupta',
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez',
  'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin'
];

const REGIONS = [
  'North India', 'South India', 'East India', 'West India', 
  'North America', 'Europe', 'Asia Pacific'
] as const;

const PLANS = ['Basic', 'Pro', 'Premium', 'Enterprise'] as const;
const PLAN_PRICES = {
  Basic: 29,
  Pro: 79,
  Premium: 149,
  Enterprise: 499
};

const PRODUCTS = ['Cloud Storage', 'AI Analytics Pro', 'Collaboration Hub', 'Security Suite', 'Product X', 'Data Sync Tool'];

export function generateCustomers(count: number = 50000): Customer[] {
  const rand = createRandom(1337); // Fixed seed for deterministic data
  const customers: Customer[] = [];

  for (let i = 1; i <= count; i++) {
    const fIdx = Math.floor(rand() * FIRST_NAMES.length);
    const lIdx = Math.floor(rand() * LAST_NAMES.length);
    const firstName = FIRST_NAMES[fIdx];
    const lastName = LAST_NAMES[lIdx];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(rand() * 100)}@example.com`;

    const age = Math.floor(rand() * 58) + 18; // 18 to 75
    const genderRand = rand();
    const gender = genderRand < 0.48 ? 'Male' : (genderRand < 0.96 ? 'Female' : 'Non-binary');
    
    // Distribute regions (higher density in South/North India and North America)
    const regRand = rand();
    let region: typeof REGIONS[number];
    if (regRand < 0.25) region = 'South India';
    else if (regRand < 0.45) region = 'North India';
    else if (regRand < 0.60) region = 'North America';
    else if (regRand < 0.75) region = 'Europe';
    else if (regRand < 0.85) region = 'West India';
    else if (regRand < 0.93) region = 'Asia Pacific';
    else region = 'East India';

    const deviceRand = rand();
    const device = deviceRand < 0.45 ? 'Desktop' : (deviceRand < 0.85 ? 'Mobile' : 'Tablet');

    const payRand = rand();
    const paymentMethod = payRand < 0.35 ? 'Credit Card' : (payRand < 0.65 ? 'UPI' : (payRand < 0.85 ? 'PayPal' : 'Bank Transfer'));

    const chanRand = rand();
    const salesChannel = chanRand < 0.4 ? 'Online' : (chanRand < 0.75 ? 'Direct' : (chanRand < 0.9 ? 'Partner' : 'Referral'));

    // Plan and tenure
    const planRand = rand();
    const subscriptionPlan = planRand < 0.40 ? 'Basic' : (planRand < 0.75 ? 'Pro' : (planRand < 0.92 ? 'Premium' : 'Enterprise'));
    const basePrice = PLAN_PRICES[subscriptionPlan];
    
    const tenure = Math.floor(rand() * 59) + 1; // 1 to 60 months
    
    // Support interactions
    let supportTickets = Math.floor(rand() * 5); // Base 0-4
    if (subscriptionPlan === 'Basic' && rand() < 0.3) supportTickets += 3; // Basic users get more issues
    if (rand() < 0.1) supportTickets += 5; // Outliers

    // CSAT
    let csat = Math.floor(rand() * 3) + 3; // Base 3-5
    if (supportTickets > 5) csat = Math.max(1, csat - Math.floor(rand() * 3) - 1); // High support ticket -> low CSAT

    const lastPurchaseDaysAgo = Math.floor(rand() * 364) + 1;

    // Products Purchased
    const numProducts = Math.floor(rand() * 3) + 1; // 1 to 3 products
    const products: string[] = [];
    // Ensure "Product X" has specific characteristics (e.g. Higher CLV users)
    const selectProductX = rand() < (subscriptionPlan === 'Enterprise' || subscriptionPlan === 'Premium' ? 0.65 : 0.15);
    if (selectProductX) {
      products.push('Product X');
    }
    while (products.length < numProducts) {
      const p = PRODUCTS[Math.floor(rand() * PRODUCTS.length)];
      if (!products.includes(p)) products.push(p);
    }

    const campRand = rand();
    const campaignResponse = campRand < 0.25 ? 'Responded' : (campRand < 0.85 ? 'Ignored' : 'Unsubscribed');

    // Churn Probability Calculations (Custom ML Model Simulation)
    // High tickets, low tenure, basic plan, low CSAT, ignored campaigns -> High Churn
    let churnFactor = 0.1;
    if (supportTickets > 4) churnFactor += 0.35;
    if (csat <= 2) churnFactor += 0.25;
    if (tenure < 6) churnFactor += 0.15;
    if (subscriptionPlan === 'Basic') churnFactor += 0.1;
    if (campaignResponse === 'Unsubscribed') churnFactor += 0.08;
    if (device === 'Mobile') churnFactor += 0.03; // Slightly higher mobile churn
    if (region === 'South India' && subscriptionPlan === 'Premium') churnFactor += 0.12; // Synthesize a regional insight

    // Add noise
    churnFactor += (rand() * 0.15) - 0.075;
    
    // Clamp churn probability
    const predictedChurnProb = Math.min(0.99, Math.max(0.01, churnFactor));
    const churnPredicted = predictedChurnProb > 0.5 ? 1 : 0;

    // CLV Calculation
    // CLV = (Monthly Price * Tenure) + product extra purchases
    let extraRevenue = 0;
    products.forEach(p => {
      if (p === 'Product X') extraRevenue += 250; // High value product
      else extraRevenue += 45;
    });
    const monthlyRevenue = basePrice + (extraRevenue / 12);
    const clv = (monthlyRevenue * tenure) + (rand() * 100);

    customers.push({
      id: `CUST-${String(i).padStart(5, '0')}`,
      name,
      email,
      age,
      gender,
      region,
      device,
      paymentMethod,
      salesChannel,
      tenure,
      subscriptionPlan,
      csat,
      supportTickets,
      lastPurchaseDaysAgo,
      productsPurchased: products,
      campaignResponse,
      predictedChurnProb: Math.round(predictedChurnProb * 100) / 100,
      churnPredicted,
      clv: Math.round(clv * 100) / 100,
      monthlyRevenue: Math.round(monthlyRevenue * 100) / 100
    });
  }

  return customers;
}

// Generate static stats helper
export const getModelMetrics = () => {
  return {
    accuracy: 0.884,
    precision: 0.842,
    recall: 0.795,
    f1Score: 0.818,
    confusionMatrix: {
      tp: 6360, // True Positive
      fp: 1192, // False Positive
      fn: 1640, // False Negative
      tn: 40808 // True Negative
    },
    // ROC Curve Points: {fpr, tpr}
    rocCurve: [
      { fpr: 0, tpr: 0 },
      { fpr: 0.02, tpr: 0.25 },
      { fpr: 0.05, tpr: 0.50 },
      { fpr: 0.10, tpr: 0.72 },
      { fpr: 0.15, tpr: 0.82 },
      { fpr: 0.25, tpr: 0.90 },
      { fpr: 0.40, tpr: 0.95 },
      { fpr: 0.60, tpr: 0.98 },
      { fpr: 0.80, tpr: 0.99 },
      { fpr: 1.0, tpr: 1.0 }
    ],
    // Feature Importances for Churn (SHAP weights)
    featureImportance: [
      { feature: 'Support Tickets', weight: 0.34, description: 'Number of customer service requests submitted' },
      { feature: 'CSAT Score', weight: 0.24, description: 'Customer satisfaction rating (1-5)' },
      { feature: 'Customer Tenure', weight: 0.18, description: 'Number of months customer has been subscribed' },
      { feature: 'Subscription Plan (Basic)', weight: 0.12, description: 'Whether the user is on the basic entry plan' },
      { feature: 'Product X Purchased', weight: -0.08, description: 'Negative weight indicates subscription to Product X protects against churn' },
      { feature: 'Campaign Unsubscription', weight: 0.05, description: 'Opting out of campaign emails' },
      { feature: 'Region (South India)', weight: 0.04, description: 'Slightly higher risk identified in South India segment' },
      { feature: 'Payment Method (UPI)', weight: -0.03, description: 'UPI auto-pay users have slightly lower churn' }
    ]
  };
};

// Mini Natural Language Search Parser / SQL generator
export interface NLQueryResult {
  query: string;
  sql: string;
  explanation: string;
  filteredCustomers: Customer[];
  chartsToShow: ('bar' | 'pie' | 'scatter' | 'kpi')[];
  summaryMetrics: {
    count: number;
    avgClv: number;
    avgTenure: number;
    churnRate: number;
  };
}

export function parseNLQuery(query: string, allCustomers: Customer[]): NLQueryResult {
  const q = query.toLowerCase().trim();
  let sql = 'SELECT * FROM customers';
  let explanation = 'Showing all customers in the database.';
  let filtered = [...allCustomers];
  let chartsToShow: ('bar' | 'pie' | 'scatter' | 'kpi')[] = ['kpi', 'bar'];

  if (q.includes('churn') && (q.includes('south india') || q.includes('south-india'))) {
    filtered = allCustomers.filter(c => c.region === 'South India' && c.churnPredicted === 1);
    sql = "SELECT * FROM customers WHERE region = 'South India' AND churn_predicted = 1";
    explanation = "Filtering for customers located in 'South India' whose predicted churn probability exceeds 50% (churn_predicted = 1). Churn risk in this region is elevated for Premium tier accounts.";
    chartsToShow = ['kpi', 'pie'];
  } else if (q.includes('highest clv') || q.includes('top clv') || q.includes('vip')) {
    filtered = [...allCustomers].sort((a, b) => b.clv - a.clv).slice(0, 100);
    sql = 'SELECT * FROM customers ORDER BY clv DESC LIMIT 100';
    explanation = 'Selecting the top 100 customers with the highest calculated Customer Lifetime Value (CLV). These represent the key account VIPs.';
    chartsToShow = ['kpi', 'scatter'];
  } else if (q.includes('revenue') && (q.includes('this quarter') || q.includes('quarter') || q.includes('q3'))) {
    filtered = allCustomers.filter(c => c.lastPurchaseDaysAgo <= 90);
    sql = 'SELECT * FROM customers WHERE last_purchase_days_ago <= 90';
    explanation = 'Filtering for customers who have made purchases within the last 90 days (approx. one business quarter) to analyze active transactional revenue.';
    chartsToShow = ['kpi', 'bar'];
  } else if (q.includes('basic') && q.includes('tickets')) {
    filtered = allCustomers.filter(c => c.subscriptionPlan === 'Basic' && c.supportTickets >= 4);
    sql = "SELECT * FROM customers WHERE subscription_plan = 'Basic' AND support_tickets >= 4";
    explanation = 'Filtering for Basic Plan subscribers who have submitted 4 or more support tickets. This is a high-risk churn segment.';
    chartsToShow = ['kpi', 'scatter'];
  } else if (q.includes('product x')) {
    filtered = allCustomers.filter(c => c.productsPurchased.includes('Product X'));
    sql = "SELECT * FROM customers WHERE products_purchased LIKE '%Product X%'";
    explanation = "Selecting users who have purchased 'Product X'. The model indicates these users have 2.3x higher lifetime value on average.";
    chartsToShow = ['kpi', 'bar'];
  } else if (q.includes('high risk') || q.includes('high churn')) {
    filtered = allCustomers.filter(c => c.predictedChurnProb >= 0.75);
    sql = 'SELECT * FROM customers WHERE predicted_churn_prob >= 0.75';
    explanation = 'Filtering for customers with an active churn probability score of 75% or higher. Immediate customer success intervention is recommended.';
    chartsToShow = ['kpi', 'pie'];
  } else if (q.includes('under 30') || q.includes('young')) {
    filtered = allCustomers.filter(c => c.age < 30);
    sql = 'SELECT * FROM customers WHERE age < 30';
    explanation = 'Filtering for customers under the age of 30 to evaluate millennial/Gen-Z demographics and device preferences.';
    chartsToShow = ['bar', 'pie'];
  } else {
    // Fallback search
    const searchWord = q.split(' ').pop() || '';
    const regionsLower = REGIONS.map(r => r.toLowerCase());
    const regIdx = regionsLower.findIndex(r => r.includes(searchWord) || searchWord.includes(r));
    
    if (regIdx !== -1) {
      const matchRegion = REGIONS[regIdx];
      filtered = allCustomers.filter(c => c.region === matchRegion);
      sql = `SELECT * FROM customers WHERE region = '${matchRegion}'`;
      explanation = `Filtering all customers located in the '${matchRegion}' region.`;
    } else {
      // General term search on subscription
      const plansLower = PLANS.map(p => p.toLowerCase());
      const planIdx = plansLower.findIndex(p => p.includes(searchWord) || searchWord.includes(p));
      if (planIdx !== -1) {
        const matchPlan = PLANS[planIdx];
        filtered = allCustomers.filter(c => c.subscriptionPlan === matchPlan);
        sql = `SELECT * FROM customers WHERE subscription_plan = '${matchPlan}'`;
        explanation = `Filtering customers subscribed to the '${matchPlan}' plan.`;
      }
    }
  }

  // Calculate metrics
  const count = filtered.length;
  const avgClv = count > 0 ? filtered.reduce((acc, c) => acc + c.clv, 0) / count : 0;
  const avgTenure = count > 0 ? filtered.reduce((acc, c) => acc + c.tenure, 0) / count : 0;
  const churnedCount = filtered.filter(c => c.churnPredicted === 1).length;
  const churnRate = count > 0 ? churnedCount / count : 0;

  return {
    query,
    sql,
    explanation,
    filteredCustomers: filtered,
    chartsToShow,
    summaryMetrics: {
      count,
      avgClv: Math.round(avgClv * 100) / 100,
      avgTenure: Math.round(avgTenure * 10) / 10,
      churnRate: Math.round(churnRate * 1000) / 10
    }
  };
}
