import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true, index: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    customer: {
      firstName: { type: String, required: true, maxlength: 80 },
      lastName: { type: String, required: true, maxlength: 80 },
      email: { type: String, lowercase: true, maxlength: 254 },
      phone: { type: String, required: true, maxlength: 30 },
    },
    selectedServices: [{ id: String, name: String, price: Number, quantity: Number }],
    selectedProducts: [{ id: String, name: String, price: Number, quantity: Number }],
    propertyAddress: { type: String, required: true, maxlength: 500 },
    propertyType: { type: String, enum: ['Residential', 'Commercial'], required: true },
    approxArea: { type: String, default: '', maxlength: 100 },
    preferredTextures: [{ type: String, maxlength: 120 }],
    selectedColours: [{ type: String, maxlength: 160 }],
    preferredDate: { type: String, default: '' },
    preferredTime: { type: String, required: true, maxlength: 120 },
    notes: { type: String, maxlength: 2000, default: '' },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending', index: true },
    smsNotification: {
      status: { type: String, enum: ['pending', 'sending', 'sent', 'failed'], default: 'pending' },
      providerMessageId: { type: String, maxlength: 200 },
      sentAt: { type: Date },
      failedAt: { type: Date },
    },
    emailNotification: {
      founderStatus: { type: String, enum: ['pending', 'sending', 'sent', 'failed'], default: 'pending' },
      customerStatus: { type: String, enum: ['pending', 'sending', 'sent', 'failed', 'skipped'], default: 'pending' },
      founderSentAt: { type: Date },
      customerSentAt: { type: Date },
      founderFailedAt: { type: Date },
      customerFailedAt: { type: Date },
    },
  },
  { timestamps: true },
);

export type Booking = InferSchemaType<typeof bookingSchema>;
export type BookingDocument = HydratedDocument<Booking>;
export const BookingModel = mongoose.model<Booking>('Booking', bookingSchema);
