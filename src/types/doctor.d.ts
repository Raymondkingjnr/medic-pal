interface IDoctors {
  name: string;
  medical_field: string;
  location: ILocation;
  rating: number;
  reviews: number;
  years_experience: number
  // image: any;
  id: number;
  appointments: IAppointment[]
  reviews: []
  about_me: string
  verified: boolean;
  top_doctor: boolean;
  availability: boolean
}

interface ILocation {
  lat: null, lng: null, city: string, state: string, address: string, country: string
}

interface IAppointment {
  id: string,
  status: string,
  client_id: string,
  doctor_id: IDoctors,
  doctor_name?: string
  created_at: string,
  client_name: string,
  client_address: string,
  appointment_date: string,
  appointment_time: string 
}