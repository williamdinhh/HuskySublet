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

  // Create sample users with different roles
  const sampleUsers = [
    {
      email: 'alex.chen@uw.edu',
      password: 'password123',
      name: 'Alex Chen',
      role: 'seller',
    },
    {
      email: 'sarah.m@uw.edu',
      password: 'password123',
      name: 'Sarah Martinez',
      role: 'seller',
    },
    {
      email: 'mike.johnson@uw.edu',
      password: 'password123',
      name: 'Mike Johnson',
      role: 'both',
    },
    {
      email: 'emily.wang@uw.edu',
      password: 'password123',
      name: 'Emily Wang',
      role: 'seller',
    },
    {
      email: 'david.kim@uw.edu',
      password: 'password123',
      name: 'David Kim',
      role: 'seller',
    },
    {
      email: 'lisa.patel@uw.edu',
      password: 'password123',
      name: 'Lisa Patel',
      role: 'both',
    },
    {
      email: 'james.lee@uw.edu',
      password: 'password123',
      name: 'James Lee',
      role: 'buyer',
    },
    {
      email: 'maya.rodriguez@uw.edu',
      password: 'password123',
      name: 'Maya Rodriguez',
      role: 'seller',
    },
    // More buyers
    {
      email: 'ryan.park@uw.edu',
      password: 'password123',
      name: 'Ryan Park',
      role: 'buyer',
    },
    {
      email: 'sophia.nguyen@uw.edu',
      password: 'password123',
      name: 'Sophia Nguyen',
      role: 'buyer',
    },
    {
      email: 'chris.taylor@uw.edu',
      password: 'password123',
      name: 'Chris Taylor',
      role: 'buyer',
    },
    {
      email: 'jessica.wong@uw.edu',
      password: 'password123',
      name: 'Jessica Wong',
      role: 'buyer',
    },
    {
      email: 'marcus.brown@uw.edu',
      password: 'password123',
      name: 'Marcus Brown',
      role: 'buyer',
    },
    {
      email: 'olivia.davis@uw.edu',
      password: 'password123',
      name: 'Olivia Davis',
      role: 'buyer',
    },
    // More sellers
    {
      email: 'jake.wilson@uw.edu',
      password: 'password123',
      name: 'Jake Wilson',
      role: 'seller',
    },
    {
      email: 'isabella.garcia@uw.edu',
      password: 'password123',
      name: 'Isabella Garcia',
      role: 'seller',
    },
  ];

  const createdUsers = [];
  for (const userData of sampleUsers) {
    try {
      // Check if user already exists
      const existing = await findUserByEmail(userData.email);
      if (existing) {
        // Update existing user with role if missing
        const updated = await updateUser(existing.id, { role: userData.role });
        if (updated) {
          console.log(`✅ Updated user role: ${existing.name} (${existing.email}) -> ${userData.role}`);
          createdUsers.push({ ...existing, role: userData.role });
        } else {
          createdUsers.push(existing);
        }
      } else {
        const user = await createUser({
          ...userData,
          preferences: {
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

  // Create sample listings
  const getPlaceholderImage = (seed) =>
    `https://source.unsplash.com/600x400/?apartment,room&sig=${seed}`;

  const sampleListings = [
    {
      ownerId: createdUsers[0]?.id,
      title: '3-bed near U-District – Summer sublet',
      price: 950,
      neighborhood: 'U-District',
      startDate: new Date('2024-06-15').toISOString(),
      endDate: new Date('2024-08-31').toISOString(),
      images: [
        getPlaceholderImage('1'),
        getPlaceholderImage('1a'),
        getPlaceholderImage('1b'),
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
        getPlaceholderImage('2'),
        getPlaceholderImage('2a'),
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
        getPlaceholderImage('3'),
        getPlaceholderImage('3a'),
        getPlaceholderImage('3b'),
        getPlaceholderImage('3c'),
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
        getPlaceholderImage('4'),
        getPlaceholderImage('4a'),
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
        getPlaceholderImage('5'),
        getPlaceholderImage('5a'),
        getPlaceholderImage('5b'),
        getPlaceholderImage('5c'),
        getPlaceholderImage('5d'),
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
        getPlaceholderImage('6'),
        getPlaceholderImage('6a'),
        getPlaceholderImage('6b'),
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
        getPlaceholderImage('8'),
        getPlaceholderImage('8a'),
        getPlaceholderImage('8b'),
        getPlaceholderImage('8c'),
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
        getPlaceholderImage('9'),
        getPlaceholderImage('9a'),
        getPlaceholderImage('9b'),
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
        getPlaceholderImage('10'),
        getPlaceholderImage('10a'),
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
        getPlaceholderImage('11'),
        getPlaceholderImage('11a'),
        getPlaceholderImage('11b'),
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
        getPlaceholderImage('12'),
        getPlaceholderImage('12a'),
        getPlaceholderImage('12b'),
        getPlaceholderImage('12c'),
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

