import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({
            success: false,
            message: 'User with this email already exists',
        });
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        phone,
    });

    if (user) {
        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token: generateToken(user._id),
            },
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'Invalid user data',
        });
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password',
        });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password',
        });
    }

    res.json({
        success: true,
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: generateToken(user._id),
        },
    });
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    res.json({
        success: true,
        data: user,
    });
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
    const { name, email, phone } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;

        const updatedUser = await user.save();

        res.json({
            success: true,
            data: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role,
            },
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }
});

/**
 * @route   POST /api/auth/admin/login
 * @desc    Admin login
 * @access  Public
 */
export const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials',
        });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Unauthorized - Admin access required',
        });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials',
        });
    }

    res.json({
        success: true,
        token: generateToken(user._id),
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});

