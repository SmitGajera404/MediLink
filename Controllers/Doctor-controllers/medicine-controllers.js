import axios from "axios";


export const getMedicinesByActiveIngredient = async(req, res) => {
    try{
        const searchText = req.query.query;
        const URL = `https://api.fda.gov/drug/label.json?search=active_ingredient:${searchText}&limit=20`
        const data = await axios.get(URL)
        res.status(200).json(data.data.results);
    } catch(error){
        res.status(500).json({ message: "Some error occurred while fetching medicines", error: error.message });
    }
}

export const getMedicinesByPurpose = async(req, res) => {
    try{
        const purpose = req.query.query;
        const URL = `https://api.fda.gov/drug/label.json?search=purpose:${purpose}&limit=20`
        const data = await axios.get(URL)
        res.status(200).json(data.data.results);
    } catch (error) {
        res.status(500).json({ message: "Some error occurred while fetching medicines", error: error.message });
    }
}

export const provideMedicinesToPatient = async( req, res ) => {
    try{
        const medicines = req.body.medicines;
        const patient = req.body.patient;
        let finalMedicines = []
        medicines.array.forEach( async element => {
            let tempMed = {}
            tempMed = await getMedicineById(element.id)
            
        });
        const medicine = await getMedicineById(id);
        if(!medicine){
            return res.status(404).json({ message: "Medicine not found" });
        }
        return medicine;
    }catch(error){
      
    }
}

const getMedicineById = async(req, res) => {
    try{
        const URL = `https://api.fda.gov/drug/label.json?search=id:${id}&limit=1`
        const data = await axios.get(URL)
        return data.data.results[0];
    }catch(error){
        return Promise.reject(error);
    }
}