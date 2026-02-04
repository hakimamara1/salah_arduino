# Database Seed Script

This script populates your MongoDB database with sample categories and products for testing and demonstration.

## What Gets Created

### Categories (6)
1. **Development Boards** - Arduino and compatible boards
2. **Sensors** - Temperature, motion, distance sensors
3. **Motors & Drivers** - Servo motors and motor drivers
4. **Display Modules** - LCD and OLED displays
5. **Communication Modules** - WiFi and Bluetooth modules
6. **Power Supply** - Power modules and regulators

### Products (16)
- **Arduino Uno R3** - Classic Arduino board
- **Arduino Nano V3** - Compact Arduino board
- **ESP32 Development Board** - WiFi + Bluetooth board
- **DHT11 Sensor** - Temperature & humidity sensor
- **HC-SR04** - Ultrasonic distance sensor
- **PIR Motion Sensor** - Motion detection module
- **SG90 Servo Motor** - Micro servo motor
- **L298N Motor Driver** - Dual H-bridge driver
- **16x2 LCD Display** - Character LCD with I2C
- **0.96" OLED Display** - Small OLED screen
- **ESP8266 WiFi Module** - WiFi connectivity
- **HC-05 Bluetooth Module** - Bluetooth communication
- **MB102 Power Supply** - Breadboard power module
- And more...

### Admin User
- Email: `admin@arduinoshop.com`
- Password: `admin123`
- Role: `admin`

## How to Run

### Step 1: Make sure MongoDB is connected
The seed script uses the `MONGODB_URI` from your `.env` file.

### Step 2: Run the seed script
```bash
npm run seed
```

### What happens:
1. ✅ Connects to MongoDB
2. 🗑️ Clears existing categories and products
3. 📁 Creates 6 categories
4. 📦 Creates 16 sample products
5. 👤 Creates admin user (if doesn't exist)
6. 🎉 Shows summary

## Output Example
```
✅ MongoDB connected successfully
🗑️  Clearing existing data...
✅ Existing data cleared
📁 Creating categories...
✅ 6 categories created
📦 Creating products...
✅ 16 products created
👤 Creating admin user...
✅ Admin user created (admin@arduinoshop.com)

🎉 Database seeded successfully!

📊 Summary:
   - Categories: 6
   - Products: 16
   - Featured Products: 10

💡 You can now start using the application!
```

## Important Notes

⚠️ **Warning**: This script will **DELETE ALL** existing categories and products before seeding. Make sure you want to do this!

💡 **Tip**: The products have placeholder Cloudinary image URLs. You'll need to replace these with actual product images uploaded to your Cloudinary account, or update the seed script with your own image URLs.

## Customizing the Seed Data

Edit `seed.js` to:
- Add more categories
- Add more products
- Change product prices
- Update product specifications
- Add real Cloudinary image URLs

## After Seeding

You can now:
1. Open the frontend at `http://localhost:5173`
2. Browse the products and categories
3. Test the shopping cart
4. Test the checkout process
5. Login as admin to manage products (if you build the admin panel)
