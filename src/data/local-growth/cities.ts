import { CityData } from '@/types/local-growth';

export const GLOBAL_CITY: CityData = {
  name: 'Global / Other Search',
  state: 'Worldwide',
  lat: 20.5937,
  lng: 78.9629 // Center of India, zoomed out
};

export const INDIAN_CITIES: CityData[] = [
  // Metro Cities
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { name: 'Delhi', state: 'Delhi', lat: 28.7041, lng: 77.1025 },
  { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  
  // Karnataka Major & Minor
  { name: 'Mysuru', state: 'Karnataka', lat: 12.2958, lng: 76.6394 },
  { name: 'Mangaluru', state: 'Karnataka', lat: 12.9141, lng: 74.8560 },
  { name: 'Hubballi', state: 'Karnataka', lat: 15.3647, lng: 75.1240 },
  { name: 'Dharwad', state: 'Karnataka', lat: 15.4589, lng: 75.0078 },
  { name: 'Belagavi', state: 'Karnataka', lat: 15.8497, lng: 74.4977 },
  { name: 'Vijayapura', state: 'Karnataka', lat: 16.8302, lng: 75.7100 },
  { name: 'Kalaburagi', state: 'Karnataka', lat: 17.3297, lng: 76.8343 },
  { name: 'Ballari', state: 'Karnataka', lat: 15.1394, lng: 76.9214 },
  { name: 'Shivamogga', state: 'Karnataka', lat: 13.9299, lng: 75.5681 },
  { name: 'Udupi', state: 'Karnataka', lat: 13.3409, lng: 74.7421 },
  { name: 'Tumakuru', state: 'Karnataka', lat: 13.3392, lng: 77.1016 },
  { name: 'Hassan', state: 'Karnataka', lat: 13.0033, lng: 76.1004 },
  { name: 'Chikkamagaluru', state: 'Karnataka', lat: 13.3161, lng: 75.7720 },
  { name: 'Chitradurga', state: 'Karnataka', lat: 14.2251, lng: 76.3980 },
  { name: 'Raichur', state: 'Karnataka', lat: 16.2076, lng: 77.3463 },
  { name: 'Bidar', state: 'Karnataka', lat: 17.9104, lng: 77.5199 },
  { name: 'Koppal', state: 'Karnataka', lat: 15.3408, lng: 76.1558 },
  { name: 'Gadag', state: 'Karnataka', lat: 15.4173, lng: 75.6200 },
  
  // Maharashtra
  { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
  { name: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898 },
  { name: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', lat: 19.8762, lng: 75.3433 },
  { name: 'Solapur', state: 'Maharashtra', lat: 17.6599, lng: 75.9064 },
  { name: 'Kolhapur', state: 'Maharashtra', lat: 16.7050, lng: 74.2433 },
  { name: 'Amravati', state: 'Maharashtra', lat: 20.9320, lng: 77.7523 },
  { name: 'Sangli', state: 'Maharashtra', lat: 16.8524, lng: 74.5815 },
  
  // Gujarat
  { name: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311 },
  { name: 'Vadodara', state: 'Gujarat', lat: 22.3072, lng: 73.1812 },
  { name: 'Rajkot', state: 'Gujarat', lat: 22.3039, lng: 70.8022 },
  { name: 'Bhavnagar', state: 'Gujarat', lat: 21.7645, lng: 72.1519 },
  { name: 'Jamnagar', state: 'Gujarat', lat: 22.4707, lng: 70.0577 },

  // Rajasthan
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { name: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243 },
  { name: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lng: 73.7125 },
  { name: 'Kota', state: 'Rajasthan', lat: 25.2138, lng: 75.8648 },
  { name: 'Bikaner', state: 'Rajasthan', lat: 28.0229, lng: 73.3119 },
  { name: 'Ajmer', state: 'Rajasthan', lat: 26.4499, lng: 74.6399 },

  // Madhya Pradesh
  { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
  { name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  { name: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1815, lng: 79.9864 },
  { name: 'Gwalior', state: 'Madhya Pradesh', lat: 26.2183, lng: 78.1828 },
  { name: 'Ujjain', state: 'Madhya Pradesh', lat: 23.1765, lng: 75.7885 },

  // Uttar Pradesh
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { name: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319 },
  { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
  { name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081 },
  { name: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463 },
  { name: 'Meerut', state: 'Uttar Pradesh', lat: 28.9845, lng: 77.7064 },
  { name: 'Noida', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910 },

  // Punjab & Haryana & Chandigarh
  { name: 'Chandigarh', state: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
  { name: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573 },
  { name: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723 },
  { name: 'Jalandhar', state: 'Punjab', lat: 31.3260, lng: 75.5762 },
  { name: 'Gurugram', state: 'Haryana', lat: 28.4595, lng: 77.0266 },
  { name: 'Faridabad', state: 'Haryana', lat: 28.4089, lng: 77.3178 },
  { name: 'Panipat', state: 'Haryana', lat: 29.3909, lng: 76.9635 },

  // Eastern & Northeast
  { name: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376 },
  { name: 'Gaya', state: 'Bihar', lat: 24.7914, lng: 85.0002 },
  { name: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245 },
  { name: 'Cuttack', state: 'Odisha', lat: 20.4625, lng: 85.8828 },
  { name: 'Guwahati', state: 'Assam', lat: 26.1158, lng: 91.7086 },
  { name: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096 },
  { name: 'Jamshedpur', state: 'Jharkhand', lat: 22.8046, lng: 86.2029 },
  { name: 'Siliguri', state: 'West Bengal', lat: 26.7271, lng: 88.3953 },
  
  // South India (Others)
  { name: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673 },
  { name: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lng: 76.9366 },
  { name: 'Kozhikode', state: 'Kerala', lat: 11.2588, lng: 75.7804 },
  { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
  { name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198 },
  { name: 'Tiruchirappalli', state: 'Tamil Nadu', lat: 10.7905, lng: 78.7047 },
  { name: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lng: 78.1460 },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185 },
  { name: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480 },
  { name: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lng: 80.4365 },
  { name: 'Tirupati', state: 'Andhra Pradesh', lat: 13.6288, lng: 79.4192 },
  { name: 'Warangal', state: 'Telangana', lat: 17.9689, lng: 79.5941 },
];
