export const DOCTORAPI = {
  BASE_URL: `https://doctors-and-medical-professionals-of-jaipur-india.p.rapidapi.com/doctors`,

  headers: {
    "x-rapidapi-key": process.env.EXPO_PUBLIC_RAPID_API_KEY || "",
    "x-rapidapi-host": process.env.EXPO_PUBLIC_RAPID_API_HOST || "",
  },
};

export const getDoctors = async ({ query }: { query: string }) => {
  const endpoint = query
    ? `${DOCTORAPI.BASE_URL}/speciality/${query}`
    : `${DOCTORAPI.BASE_URL}/area/jaipur`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: DOCTORAPI.headers,
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const data = await response.json();
  return data;
};
