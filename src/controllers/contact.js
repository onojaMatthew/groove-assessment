import dotenv from "dotenv";
import Contact from "../entities/contact";

/**
 * A simple CRUD controller for contacts
 * Create the necessary controller methods 
 */

dotenv.config()
//  get all contacts
export const all = async (req, res) => {
    try {
        let contacts = await Contact.find({}).populate("createdBy");
        if (!contacts) return res.status(404).json({ error: "No records found" });
        return res.json(contacts);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

// gets a single contact
export const get = async (req, res) => {
    const { contactId } = req.params;

    try {
        if (!contactId) return res.status(400).json({ error: "Missing parameter: CONTACT ID" });
        let contact = await Contact.findById({ _id: contactId }).populate("createdBy");
        if (!contact) return res.status(404).json({ error: "Record does not exist" });
        return res.json(contact);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

// create a new contact
export const create = async (req, res) => {
    const { _id } = req.user;
    console.log(req.body, "right here")
    const { name, email, phone, officePhone, address } = req.body;

    try {
        let contact = await Contact.findOne({ phone });

        if (contact) return res.status(400).json({ error: "Contact already exists in the addresss book" });
        let newContact = new Contact({ name, phone, officePhone, address, createdBy: _id , email});

        newContact = await newContact.save();

        if (!newContact) return res.status(400).json({ error: "Request failed. Try again after some time" });
        return res.json(newContact);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

// updates a contact
export const update = async (req, res) => {
    const { contactId, email, name, phone, address, officePhone } = req.body;

    if (!contactId) return res.status(400).json({ error: "Missing parameter: CONTACTID" });
    try {
        let contact = await Contact.findById({ _id: contactId });
        if (!contact) return res.status(400).json({ error: "Contact not found" });
        if (name) contact.name = name;
        if (phone) contact.phone = phone;
        if (address) contact.address = address;
        if (officePhone) contact.officePhone = officePhone;
        if (email) contact.email = email;

        contact = await contact.save();
        return res.json(contact);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

// removes a contact
export const remove = async (req, res) => {
    const { contactId } = req.params;
    if (!contactId) return res.status(400).json({ error: "Missing parameter: CONTACTID" });
    
    try {
        let contact = await Contact.findByIdAndRemove({ _id: contactId });
        if (!contact) return res.status(404).json({ error: "Contact not found" });
        return res.json({ message: "Contact deleted" });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export default {
    // get all contacts for a user
    all,
    // get a single contact
    get,
    // // create a single contact
    create,
    // // update a single contact
    update,
    // // remove a single contact
    remove
}