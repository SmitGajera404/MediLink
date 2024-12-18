import User from "../../Models/User.js";

export const getPatient = async (req, res) => {
    try {
        const patient = await User.findOne({ username: req.query.username, role:'patient' })
        if (!patient) {
            res.status(404).json({ message: "Patient not found" });
        } else {
            res.status(200).json(patient);
        }
    } catch (error) {
        res.status(500).json({ message: "Some error occurred while fetching patient data", error: error.message });
    }
}
