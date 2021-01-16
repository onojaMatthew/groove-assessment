import mongoose, { Schema, ObjectId } from 'mongoose';

export const ContactSchema = new Schema(
    {
        //  define the necessary fields for your contact list
        name: { type: String, required: [ true, "Last name is required" ]},
        email: { type: String, unique: true, required: [ true, "Your email address is required" ]},
        phone: { type: String, unique: true, required: [ true, "Phone number is required" ]},
        officePhone: { type: String },
        address: { type: String,  },
        createdBy: { type: ObjectId, ref: "User", required: true },

    },
    { timestamps: true },
    { collection: 'contacts' }
)

export default mongoose.model('Contact', ContactSchema);
