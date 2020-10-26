/* this class files are intended to maintain real world like objects
keep my life bit easy*/

class Customer {
    constructor(data){
        this.nic = data.NIC;
        this.dob = data.dob;
        this.contact_id = data.contact_id;     
    }

    getNIC(){
        return this.nic
    }

}

export default Customer