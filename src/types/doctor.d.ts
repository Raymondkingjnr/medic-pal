interface IDoctors {
  name: string;
  medical_field: string;
  location: ILocation;
  rating: number;
  reviews: number;
  years_of_experiance: number
  // image: any;
  id: number;
  appointments: IAppointment[]
  reviews: []
}

interface ILocation {
  lat: null, lng: null, city: string, state: string, address: string, country: string
}

interface IAppointment {
  id: string,
  status: string,
  client_id: string,
  doctor_id: null,
  created_at: string,
  client_name: string,
  client_address: string,
  appointment_date: string,
  appointment_time: string 
}