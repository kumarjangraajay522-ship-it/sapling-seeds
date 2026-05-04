import Enquiry from '../models/Enquiry.js';

// @desc    Create a new enquiry (contact or callback)
// @route   POST /api/v1/enquiry
// @access  Public
export const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, message, page, type } = req.body;

    if (!name || !phone || !type) {
      return res.status(400).json({ error: 'Name, phone, and type are required' });
    }

    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      message,
      page,
      type,
    });

    res.status(201).json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get all enquiries
// @route   GET /api/v1/enquiry
// @access  Private/Admin
export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Update enquiry status
// @route   PUT /api/v1/enquiry/:id
// @access  Private/Admin
export const updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    res.status(200).json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Delete an enquiry
// @route   DELETE /api/v1/enquiry/:id
// @access  Private/Admin
export const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
