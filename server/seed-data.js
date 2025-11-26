import { getDb, saveDb, createUser, createListing, findUserByEmail, updateUser } from './db.js';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  console.log('🌱 Seeding database with initial data...');

  const data = await getDb();

  // Check if we already have seed data
  if (data.listings.length > 0) {
    console.log('⚠️  Database already has listings. Skipping seed.');
    return;
  }

  // Helper to get profile image
  const getProfileImage = (name, seed) => {
    // Use UI Avatars or a similar service for profile pictures
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=667eea&color=fff&bold=true&font-size=0.5`;
  };

  // Helper to get apartment/room images
  const getPlaceholderImage = (seed) =>
    `https://source.unsplash.com/600x400/?apartment,room&sig=${seed}`;

  // Create sample users with different roles
  const sampleUsers = [
    {
      email: 'alex.chen@uw.edu',
      password: 'password123',
      name: 'Alex Chen',
      role: 'seller',
      profileImage: getProfileImage('Alex Chen', 'alex'),
    },
    {
      email: 'sarah.m@uw.edu',
      password: 'password123',
      name: 'Sarah Martinez',
      role: 'seller',
      profileImage: getProfileImage('Sarah Martinez', 'sarah'),
    },
    {
      email: 'mike.johnson@uw.edu',
      password: 'password123',
      name: 'Mike Johnson',
      role: 'both',
      profileImage: getProfileImage('Mike Johnson', 'mike'),
    },
    {
      email: 'emily.wang@uw.edu',
      password: 'password123',
      name: 'Emily Wang',
      role: 'seller',
      profileImage: getProfileImage('Emily Wang', 'emily'),
    },
    {
      email: 'david.kim@uw.edu',
      password: 'password123',
      name: 'David Kim',
      role: 'seller',
      profileImage: getProfileImage('David Kim', 'david'),
    },
    {
      email: 'lisa.patel@uw.edu',
      password: 'password123',
      name: 'Lisa Patel',
      role: 'both',
      profileImage: getProfileImage('Lisa Patel', 'lisa'),
    },
    {
      email: 'james.lee@uw.edu',
      password: 'password123',
      name: 'James Lee',
      role: 'buyer',
      profileImage: getProfileImage('James Lee', 'james'),
      preferences: {
        priceRange: { min: 800, max: 1200 },
        numRoommates: '1',
        preferredGenders: ['Any'],
        preferredLocations: ['U-District', 'Capitol Hill'],
      },
    },
    {
      email: 'maya.rodriguez@uw.edu',
      password: 'password123',
      name: 'Maya Rodriguez',
      role: 'seller',
      profileImage: getProfileImage('Maya Rodriguez', 'maya'),
    },
    // More buyers
    {
      email: 'ryan.park@uw.edu',
      password: 'password123',
      name: 'Ryan Park',
      role: 'buyer',
      profileImage: getProfileImage('Ryan Park', 'ryan'),
      preferences: {
        priceRange: { min: 600, max: 1000 },
        numRoommates: '2',
        preferredGenders: ['Male'],
        preferredLocations: ['U-District'],
      },
    },
    {
      email: 'sophia.nguyen@uw.edu',
      password: 'password123',
      name: 'Sophia Nguyen',
      role: 'buyer',
      profileImage: getProfileImage('Sophia Nguyen', 'sophia'),
      preferences: {
        priceRange: { min: 900, max: 1400 },
        numRoommates: 'Any',
        preferredGenders: ['Female', 'Any'],
        preferredLocations: ['Capitol Hill', 'U-District'],
      },
    },
    {
      email: 'chris.taylor@uw.edu',
      password: 'password123',
      name: 'Chris Taylor',
      role: 'buyer',
      profileImage: getProfileImage('Chris Taylor', 'chris'),
      preferences: {
        priceRange: { min: 700, max: 1100 },
        numRoommates: '1',
        preferredGenders: ['Any'],
        preferredLocations: ['Northgate', 'U-District'],
      },
    },
    {
      email: 'jessica.wong@uw.edu',
      password: 'password123',
      name: 'Jessica Wong',
      role: 'buyer',
      profileImage: getProfileImage('Jessica Wong', 'jessica'),
      preferences: {
        priceRange: { min: 1000, max: 1500 },
        numRoommates: '0',
        preferredGenders: ['Female'],
        preferredLocations: ['Capitol Hill'],
      },
    },
    {
      email: 'marcus.brown@uw.edu',
      password: 'password123',
      name: 'Marcus Brown',
      role: 'buyer',
      profileImage: getProfileImage('Marcus Brown', 'marcus'),
      preferences: {
        priceRange: { min: 500, max: 900 },
        numRoommates: '2',
        preferredGenders: ['Any'],
        preferredLocations: ['U-District', 'Northgate'],
      },
    },
    {
      email: 'olivia.davis@uw.edu',
      password: 'password123',
      name: 'Olivia Davis',
      role: 'buyer',
      profileImage: getProfileImage('Olivia Davis', 'olivia'),
      preferences: {
        priceRange: { min: 850, max: 1300 },
        numRoommates: '1',
        preferredGenders: ['Female', 'Non-binary'],
        preferredLocations: ['Capitol Hill', 'U-District'],
      },
    },
    // More sellers
    {
      email: 'jake.wilson@uw.edu',
      password: 'password123',
      name: 'Jake Wilson',
      role: 'seller',
      profileImage: getProfileImage('Jake Wilson', 'jake'),
    },
    {
      email: 'isabella.garcia@uw.edu',
      password: 'password123',
      name: 'Isabella Garcia',
      role: 'seller',
      profileImage: getProfileImage('Isabella Garcia', 'isabella'),
    },
  ];

  const createdUsers = [];
  for (const userData of sampleUsers) {
    try {
      // Check if user already exists
      const existing = await findUserByEmail(userData.email);
      if (existing) {
        // Update existing user with role and preferences if missing
        const updateData = { role: userData.role };
        if (userData.preferences) {
          updateData.preferences = userData.preferences;
        }
        const updated = await updateUser(existing.id, updateData);
        if (updated) {
          console.log(`✅ Updated user: ${existing.name} (${existing.email})`);
          createdUsers.push({ ...existing, ...updateData });
        } else {
          createdUsers.push(existing);
        }
      } else {
        const user = await createUser({
          ...userData,
          preferences: userData.preferences || {
            priceRange: { min: 0, max: 2000 },
            numRoommates: 'Any',
            preferredGenders: ['Any'],
            preferredLocations: [],
          },
        });
        createdUsers.push(user);
        console.log(`✅ Created user: ${user.name} (${user.email})`);
      }
    } catch (error) {
      console.log(`⚠️  Error with user ${userData.email}:`, error.message);
    }
  }

  // Create sample listings (getPlaceholderImage already defined above)

  const sampleListings = [
    {
      ownerId: createdUsers[0]?.id,
      title: '3-bed near U-District – Summer sublet',
      price: 950,
      neighborhood: 'U-District',
      startDate: new Date('2024-06-15').toISOString(),
      endDate: new Date('2024-08-31').toISOString(),
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
      ],
      vibes: ['Quiet', 'Clean', 'Pet-friendly'],
      promptQuestion: 'What makes this place special?',
      promptAnswer: 'Right next to campus with a rooftop view of Mount Rainier. Plus, my cat Oliver will be here to greet you!',
    },
    {
      ownerId: createdUsers[1]?.id,
      title: 'Cozy studio in Capitol Hill',
      price: 1200,
      neighborhood: 'Capitol Hill',
      startDate: new Date('2024-07-01').toISOString(),
      endDate: new Date('2024-09-15').toISOString(),
      images: [
        'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop',
      ],
      vibes: ['Social', 'Modern', 'Near nightlife'],
      promptQuestion: 'Perfect roommate is...',
      promptAnswer: 'Someone who loves exploring local coffee shops and doesn\'t mind the occasional house party! Weekend brunch enthusiast a plus.',
    },
    {
      ownerId: createdUsers[2]?.id,
      title: 'Shared house with backyard - Northgate',
      price: 750,
      neighborhood: 'Northgate',
      startDate: new Date('2024-06-01').toISOString(),
      endDate: new Date('2024-08-20').toISOString(),
      images: [
        'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1560448075-cbc16bb4af80?w=600&h=400&fit=crop',
      ],
      vibes: ['Chill', 'Spacious', 'Backyard'],
      promptQuestion: 'What\'s your ideal weekend?',
      promptAnswer: 'BBQs in the backyard, board game nights, and walks to the light rail. We\'re pretty low-key but always down to hang.',
    },
    {
      ownerId: createdUsers[3]?.id,
      title: 'Private room - walking distance to UW',
      price: 850,
      neighborhood: 'U-District',
      startDate: new Date('2024-05-25').toISOString(),
      endDate: new Date('2024-09-01').toISOString(),
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&h=400&fit=crop',
      ],
      vibes: ['Quiet', 'Study-friendly', 'Furnished'],
      promptQuestion: 'What are you looking for in a subletter?',
      promptAnswer: 'A quiet, responsible student. I have finals so need someone respectful of study time. Fully furnished with a desk!',
    },
    {
      ownerId: createdUsers[4]?.id,
      title: 'Loft apartment with skyline views',
      price: 1400,
      neighborhood: 'Capitol Hill',
      startDate: new Date('2024-06-10').toISOString(),
      endDate: new Date('2024-08-25').toISOString(),
      images: [
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1560448204-61dc7191c0c2?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556912173-2e38e0e58b9a?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1560448076-0d0d494344a0?w=600&h=400&fit=crop',
      ],
      vibes: ['Modern', 'Bright', 'Gym access'],
      promptQuestion: 'Three things to know about this place',
      promptAnswer: '1) Floor-to-ceiling windows 2) Building has a gym and rooftop deck 3) Walking distance to Pike Place Market',
    },
    {
      ownerId: createdUsers[5]?.id,
      title: 'Room in grad student house',
      price: 800,
      neighborhood: 'U-District',
      startDate: new Date('2024-06-20').toISOString(),
      endDate: new Date('2024-09-10').toISOString(),
      images: [
        'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&h=400&fit=crop',
      ],
      vibes: ['Academic', 'Collaborative', 'Plant-filled'],
      promptQuestion: 'What\'s the vibe of the house?',
      promptAnswer: 'PhD students in STEM fields. Lots of late-night study sessions, espresso machine always running, and indoor plants everywhere.',
    },
    {
      ownerId: createdUsers[7]?.id,
      title: 'Artist\'s loft near Pike Place',
      price: 1100,
      neighborhood: 'Other',
      startDate: new Date('2024-06-15').toISOString(),
      endDate: new Date('2024-09-05').toISOString(),
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=600&h=400&fit=crop',
      ],
      vibes: ['Creative', 'Unique', 'Natural light'],
      promptQuestion: 'What\'s your space like?',
      promptAnswer: 'Exposed brick, huge windows, and an artsy neighborhood. I\'m a painter so there\'s lots of natural light and creative energy.',
    },
    // More listings
    {
      ownerId: createdUsers[15]?.id, // Jake Wilson
      title: 'Modern 2-bedroom with balcony',
      price: 1300,
      neighborhood: 'Capitol Hill',
      startDate: new Date('2024-07-01').toISOString(),
      endDate: new Date('2024-09-30').toISOString(),
      images: [
        'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&h=400&fit=crop',
      ],
      vibes: ['Modern', 'Bright', 'Balcony'],
      promptQuestion: 'Best feature of this place?',
      promptAnswer: 'Amazing city views from the private balcony and a fully updated kitchen with stainless steel appliances.',
    },
    {
      ownerId: createdUsers[16]?.id, // Isabella Garcia
      title: 'Spacious room in shared house',
      price: 700,
      neighborhood: 'U-District',
      startDate: new Date('2024-06-10').toISOString(),
      endDate: new Date('2024-08-31').toISOString(),
      images: [
        'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&h=400&fit=crop',
      ],
      vibes: ['Spacious', 'Social', 'Furnished'],
      promptQuestion: 'What\'s the house like?',
      promptAnswer: 'Big shared kitchen, living room with TV, and friendly roommates. Perfect for someone who likes to socialize!',
    },
    {
      ownerId: createdUsers[0]?.id, // Alex Chen - second listing
      title: 'Private basement suite',
      price: 900,
      neighborhood: 'Northgate',
      startDate: new Date('2024-07-15').toISOString(),
      endDate: new Date('2024-09-15').toISOString(),
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&h=400&fit=crop',
      ],
      vibes: ['Private', 'Quiet', 'Parking included'],
      promptQuestion: 'Why choose this place?',
      promptAnswer: 'Complete privacy with your own entrance, bathroom, and kitchenette. Plus free parking spot included!',
    },
    {
      ownerId: createdUsers[4]?.id, // David Kim - second listing
      title: 'Luxury apartment with amenities',
      price: 1600,
      neighborhood: 'Capitol Hill',
      startDate: new Date('2024-06-20').toISOString(),
      endDate: new Date('2024-10-01').toISOString(),
      images: [
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1560448204-61dc7191c0c2?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556912173-2e38e0e58b9a?w=600&h=400&fit=crop',
      ],
      vibes: ['Modern', 'Gym access', 'Rooftop'],
      promptQuestion: 'What amenities are included?',
      promptAnswer: 'Building has a 24/7 gym, rooftop deck with BBQ, and secure parking. Walking distance to everything!',
    },
  ];

  for (const listingData of sampleListings) {
    if (listingData.ownerId) {
      try {
        const listing = await createListing(listingData);
        console.log(`✅ Created listing: ${listing.title}`);
      } catch (error) {
        console.error(`❌ Failed to create listing: ${listingData.title}`, error);
      }
    }
  }

  console.log('🎉 Database seeding complete!');
}

// Only run if called directly (not imported)
if (import.meta.url.endsWith(process.argv[1]?.replace(/\\/g, '/') || '')) {
  seedDatabase().catch(console.error);
}

