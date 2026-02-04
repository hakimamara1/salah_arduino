import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Product from './models/Product.js';
import User from './models/User.js';

dotenv.config();

// Sample categories
const categories = [
    {
        name: 'Development Boards',
        slug: 'development-boards',
        description: 'Arduino and compatible development boards for your projects',
        image: {
            url: 'https://res.cloudinary.com/demo/image/upload/arduino-board.jpg',
            publicId: 'arduino-board',
        },
        isActive: true,
    },
    {
        name: 'Sensors',
        slug: 'sensors',
        description: 'Various sensors for temperature, humidity, motion, and more',
        image: {
            url: 'https://res.cloudinary.com/demo/image/upload/sensors.jpg',
            publicId: 'sensors',
        },
        isActive: true,
    },
    {
        name: 'Motors & Drivers',
        slug: 'motors-drivers',
        description: 'Stepper motors, servo motors, and motor driver modules',
        image: {
            url: 'https://res.cloudinary.com/demo/image/upload/motors.jpg',
            publicId: 'motors',
        },
        isActive: true,
    },
    {
        name: 'Display Modules',
        slug: 'display-modules',
        description: 'LCD, OLED, LED displays for your Arduino projects',
        image: {
            url: 'https://res.cloudinary.com/demo/image/upload/displays.jpg',
            publicId: 'displays',
        },
        isActive: true,
    },
    {
        name: 'Communication Modules',
        slug: 'communication-modules',
        description: 'WiFi, Bluetooth, RF modules for wireless communication',
        image: {
            url: 'https://res.cloudinary.com/demo/image/upload/communication.jpg',
            publicId: 'communication',
        },
        isActive: true,
    },
    {
        name: 'Power Supply',
        slug: 'power-supply',
        description: 'Batteries, power adapters, and voltage regulators',
        image: {
            url: 'https://res.cloudinary.com/demo/image/upload/power.jpg',
            publicId: 'power',
        },
        isActive: true,
    },
];

// Sample products (will be created after categories)
const getProducts = (categories) => [
    // Development Boards
    {
        name: 'Arduino Uno R3',
        slug: 'arduino-uno-r3',
        description: 'The classic Arduino board, perfect for beginners and advanced makers alike. Features ATmega328P microcontroller with 14 digital I/O pins and 6 analog inputs.',
        price: 2500,
        compareAtPrice: 3000,
        category: categories.find(c => c.slug === 'development-boards')._id,
        stock: 50,
        sku: 'ARD-UNO-R3',
        images: [
            {
                url: 'https://res.cloudinary.com/demo/image/upload/arduino-uno.jpg',
                publicId: 'arduino-uno',
                alt: 'Arduino Uno R3 Development Board',
            },
        ],
        specifications: {
            voltage: '5V',
            current: '500mA',
            interface: 'USB Type-B',
            chipset: 'ATmega328P',
            pins: '14 Digital, 6 Analog',
            flash: '32KB',
            sram: '2KB',
            eeprom: '1KB',
            clockSpeed: '16MHz',
        },
        features: [
            '14 digital I/O pins',
            '6 analog inputs',
            'USB connection',
            'Power jack',
            'ICSP header',
            'Reset button',
        ],
        isFeatured: true,
        isActive: true,
        metaTitle: 'Arduino Uno R3 - Original Development Board',
        metaDescription: 'Buy original Arduino Uno R3 board with ATmega328P. Perfect for beginners and makers. Fast delivery in Algeria.',
        metaKeywords: ['arduino uno', 'arduino r3', 'development board', 'atmega328p', 'microcontroller'],
    },
    {
        name: 'Arduino Nano V3',
        slug: 'arduino-nano-v3',
        description: 'Compact Arduino board with the same functionality as the Uno but in a breadboard-friendly form factor. Perfect for space-constrained projects.',
        price: 1800,
        compareAtPrice: 2200,
        category: categories.find(c => c.slug === 'development-boards')._id,
        stock: 75,
        sku: 'ARD-NANO-V3',
        images: [
            {
                url: 'https://res.cloudinary.com/demo/image/upload/arduino-nano.jpg',
                publicId: 'arduino-nano',
                alt: 'Arduino Nano V3 Compact Board',
            },
        ],
        specifications: {
            voltage: '5V',
            current: '500mA',
            interface: 'Mini USB',
            chipset: 'ATmega328P',
            pins: '14 Digital, 8 Analog',
            flash: '32KB',
            sram: '2KB',
            eeprom: '1KB',
            clockSpeed: '16MHz',
        },
        isFeatured: true,
        isActive: true,
        metaTitle: 'Arduino Nano V3 - Compact Development Board',
        metaDescription: 'Compact Arduino Nano with ATmega328P. Breadboard-friendly design for your projects.',
    },
    {
        name: 'ESP32 Development Board',
        slug: 'esp32-development-board',
        description: 'Powerful WiFi and Bluetooth enabled microcontroller with dual-core processor. Ideal for IoT projects and wireless applications.',
        price: 2200,
        compareAtPrice: 2800,
        category: categories.find(c => c.slug === 'development-boards')._id,
        stock: 60,
        sku: 'ESP32-DEV',
        images: [
            {
                url: 'https://res.cloudinary.com/demo/image/upload/esp32.jpg',
                publicId: 'esp32',
                alt: 'ESP32 WiFi Bluetooth Development Board',
            },
        ],
        specifications: {
            voltage: '3.3V',
            current: '500mA',
            interface: 'Micro USB',
            chipset: 'ESP32-WROOM-32',
            pins: '30 GPIO',
            flash: '4MB',
            sram: '520KB',
            clockSpeed: '240MHz',
            wireless: 'WiFi + Bluetooth',
        },
        isFeatured: true,
        isActive: true,
        metaTitle: 'ESP32 Development Board - WiFi & Bluetooth',
        metaDescription: 'ESP32 board with WiFi and Bluetooth. Dual-core processor for IoT projects.',
    },

    // Sensors
    {
        name: 'DHT11 Temperature & Humidity Sensor',
        slug: 'dht11-temperature-humidity-sensor',
        description: 'Basic temperature and humidity sensor module with digital output. Perfect for weather stations and environmental monitoring.',
        price: 450,
        compareAtPrice: 600,
        category: categories.find(c => c.slug === 'sensors')._id,
        stock: 100,
        sku: 'DHT11-TEMP',
        images: [
            {
                url: 'https://res.cloudinary.com/demo/image/upload/dht11.jpg',
                publicId: 'dht11',
                alt: 'DHT11 Temperature and Humidity Sensor',
            },
        ],
        specifications: {
            voltage: '3.3V - 5V',
            current: '2.5mA',
            interface: 'Digital',
            tempRange: '0-50°C',
            humidityRange: '20-80%',
            accuracy: '±2°C, ±5%RH',
        },
        isFeatured: true,
        isActive: true,
    },
    {
        name: 'HC-SR04 Ultrasonic Distance Sensor',
        slug: 'hc-sr04-ultrasonic-sensor',
        description: 'Ultrasonic ranging module for distance measurement from 2cm to 400cm. Ideal for obstacle avoidance and robotics.',
        price: 350,
        compareAtPrice: 500,
        category: categories.find(c => c.slug === 'sensors')._id,
        stock: 120,
        sku: 'HC-SR04-DIST',
        images: [
            {
                url: 'https://res.cloudinary.com/demo/image/upload/hc-sr04.jpg',
                publicId: 'hc-sr04',
                alt: 'HC-SR04 Ultrasonic Distance Sensor',
            },
        ],
        specifications: {
            voltage: '5V',
            current: '15mA',
            interface: 'Digital',
            range: '2cm - 400cm',
            angle: '15 degrees',
            frequency: '40kHz',
        },
        isFeatured: true,
        isActive: true,
    },
    {
        name: 'PIR Motion Sensor Module',
        slug: 'pir-motion-sensor',
        description: 'Passive infrared sensor for motion detection. Perfect for security systems and automatic lighting projects.',
        price: 400,
        compareAtPrice: 550,
        category: categories.find(c => c.slug === 'sensors')._id,
        stock: 80,
        sku: 'PIR-MOTION',
        images: [
            {
                url: 'https://res.cloudinary.com/demo/image/upload/pir.jpg',
                publicId: 'pir',
                alt: 'PIR Motion Sensor Module',
            },
        ],
        specifications: {
            voltage: '5V - 12V',
            current: '65mA',
            interface: 'Digital',
            range: '7 meters',
            angle: '120 degrees',
            delay: 'Adjustable',
        },
        isActive: true,
    },

    // Motors & Drivers
    {
        name: 'SG90 Micro Servo Motor',
        slug: 'sg90-micro-servo',
        description: 'Compact 9g servo motor for precise angular control. Perfect for robotics, RC projects, and automation.',
        price: 650,
        compareAtPrice: 800,
        category: categories.find(c => c.slug === 'motors-drivers')._id,
        stock: 90,
        sku: 'SG90-SERVO',
        images: [
            {
                url: 'https://res.cloudinary.com/demo/image/upload/sg90.jpg',
                publicId: 'sg90',
                alt: 'SG90 Micro Servo Motor',
            },
        ],
        specifications: {
            voltage: '4.8V - 6V',
            current: '200mA',
            torque: '1.8kg/cm',
            speed: '0.1s/60°',
            rotation: '180 degrees',
            weight: '9g',
        },
        isFeatured: true,
        isActive: true,
    },
    {
        name: 'L298N Motor Driver Module',
        slug: 'l298n-motor-driver',
        description: 'Dual H-bridge motor driver for controlling DC motors and stepper motors. Supports up to 2A per channel.',
        price: 850,
        compareAtPrice: 1100,
        category: categories.find(c => c.slug === 'motors-drivers')._id,
        stock: 70,
        sku: 'L298N-DRIVER',
        images: [
            {
                url: 'https://res.cloudinary.com/demo/image/upload/l298n.jpg',
                publicId: 'l298n',
                alt: 'L298N Motor Driver Module',
            },
        ],
        specifications: {
            voltage: '5V - 35V',
            current: '2A per channel',
            interface: 'PWM',
            chipset: 'L298N',
            channels: '2',
            logicVoltage: '5V',
        },
        isFeatured: true,
        isActive: true,
    },

    // Display Modules
    {
        name: '16x2 LCD Display with I2C',
        slug: '16x2-lcd-i2c',
        description: '16 character by 2 line LCD display with I2C interface. Easy to use with only 2 wires for Arduino connection.',
        price: 1200,
        compareAtPrice: 1500,
        category: categories.find(c => c.slug === 'display-modules')._id,
        stock: 60,
        sku: 'LCD-16X2-I2C',
        images: [
            {
                url: 'https://res.cloudinary.com/demo/image/upload/lcd-16x2.jpg',
                publicId: 'lcd-16x2',
                alt: '16x2 LCD Display with I2C',
            },
        ],
        specifications: {
            voltage: '5V',
            current: '120mA',
            interface: 'I2C',
            display: '16x2 characters',
            backlight: 'Blue LED',
            controller: 'HD44780',
        },
        isFeatured: true,
        isActive: true,
    },
    {
        name: '0.96" OLED Display I2C',
        slug: '096-oled-display-i2c',
        description: 'Small OLED display with high contrast and wide viewing angle. Perfect for compact projects.',
        price: 1400,
        compareAtPrice: 1800,
        category: categories.find(c => c.slug === 'display-modules')._id,
        stock: 50,
        sku: 'OLED-096-I2C',
        images: [
            {
                url: 'https://res.cloudinary.com/demo/image/upload/oled-096.jpg',
                publicId: 'oled-096',
                alt: '0.96 inch OLED Display',
            },
        ],
        specifications: {
            voltage: '3.3V - 5V',
            current: '20mA',
            interface: 'I2C',
            resolution: '128x64',
            size: '0.96 inch',
            controller: 'SSD1306',
        },
        isFeatured: true,
        isActive: true,
    },

    // Communication Modules
    {
        name: 'ESP8266 WiFi Module',
        slug: 'esp8266-wifi-module',
        description: 'Low-cost WiFi module for adding wireless connectivity to your Arduino projects. Supports IoT applications.',
        price: 1500,
        compareAtPrice: 1900,
        category: categories.find(c => c.slug === 'communication-modules')._id,
        stock: 65,
        sku: 'ESP8266-WIFI',
        images: [
            {
                url: 'https://res.cloudinary.com/demo/image/upload/esp8266.jpg',
                publicId: 'esp8266',
                alt: 'ESP8266 WiFi Module',
            },
        ],
        specifications: {
            voltage: '3.3V',
            current: '215mA',
            interface: 'UART',
            chipset: 'ESP8266',
            wireless: '802.11 b/g/n',
            frequency: '2.4GHz',
        },
        isFeatured: true,
        isActive: true,
    },
    {
        name: 'HC-05 Bluetooth Module',
        slug: 'hc-05-bluetooth-module',
        description: 'Bluetooth serial module for wireless communication. Can be configured as master or slave.',
        price: 1100,
        compareAtPrice: 1400,
        category: categories.find(c => c.slug === 'communication-modules')._id,
        stock: 70,
        sku: 'HC-05-BT',
        images: [
            {
                url: 'https://res.cloudinary.com/demo/image/upload/hc-05.jpg',
                publicId: 'hc-05',
                alt: 'HC-05 Bluetooth Module',
            },
        ],
        specifications: {
            voltage: '3.3V - 6V',
            current: '50mA',
            interface: 'UART',
            range: '10 meters',
            version: 'Bluetooth 2.0',
            baud: '9600 default',
        },
        isActive: true,
    },

    // Power Supply
    {
        name: 'MB102 Breadboard Power Supply',
        slug: 'mb102-breadboard-power',
        description: 'Dual output breadboard power supply module. Provides 3.3V and 5V outputs for your circuits.',
        price: 350,
        compareAtPrice: 500,
        category: categories.find(c => c.slug === 'power-supply')._id,
        stock: 100,
        sku: 'MB102-POWER',
        images: [
            {
                url: 'https://res.cloudinary.com/demo/image/upload/mb102.jpg',
                publicId: 'mb102',
                alt: 'MB102 Breadboard Power Supply',
            },
        ],
        specifications: {
            input: '6.5V - 12V DC / USB',
            output: '3.3V / 5V',
            current: '700mA max',
            interface: 'USB / DC Jack',
            indicator: 'Power LED',
            protection: 'Overcurrent',
        },
        isActive: true,
    },
];

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

// Seed function
const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Category.deleteMany({});
        await Product.deleteMany({});
        console.log('✅ Existing data cleared');

        // Create categories
        console.log('📁 Creating categories...');
        const createdCategories = await Category.insertMany(categories);
        console.log(`✅ ${createdCategories.length} categories created`);

        // Create products
        console.log('📦 Creating products...');
        const products = getProducts(createdCategories);
        const createdProducts = await Product.insertMany(products);
        console.log(`✅ ${createdProducts.length} products created`);

        // Create admin user (optional)
        const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (!adminExists) {
            console.log('👤 Creating admin user...');
            await User.create({
                name: 'Admin',
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
                role: 'admin',
            });
            console.log(`✅ Admin user created (${process.env.ADMIN_EMAIL})`);
        } else {
            console.log('ℹ️  Admin user already exists');
        }

        console.log('\n🎉 Database seeded successfully!');
        console.log(`\n📊 Summary:`);
        console.log(`   - Categories: ${createdCategories.length}`);
        console.log(`   - Products: ${createdProducts.length}`);
        console.log(`   - Featured Products: ${createdProducts.filter(p => p.isFeatured).length}`);
        console.log(`\n💡 You can now start using the application!`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        process.exit(1);
    }
};

// Run seed
seedDatabase();
