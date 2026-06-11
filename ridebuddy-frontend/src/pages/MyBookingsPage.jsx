import { useEffect, useState } from "react";
import api from "../services/api";

function MyBookingsPage() {

    const role = localStorage.getItem("role");

    if(role !== "USER"){
    return <Navigate to="/rides" />;
    }

    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {

        try {

            const response =
                await api.get(
                    "/bookings/my-bookings"
                );

            setBookings(response.data);

        } catch(error){
            console.log(error);
        }
    };

    const cancelBooking = async (bookingId) => {

        try {

            await api.put(
                `/bookings/${bookingId}/cancel`
            );

            alert("Booking Cancelled");

            fetchBookings();

        } catch(error){
            console.log(error);
        }
    };

    return (
        <div>

            <h1>My Bookings</h1>

            {
                bookings.map((booking)=>(
                    <div
                        key={booking.bookingId}
                        style={{
                            border:"1px solid black",
                            margin:"10px",
                            padding:"10px"
                        }}
                    >

                        <h3>
                            Booking #{booking.bookingId}
                        </h3>

                        <p>
                            Ride Id :
                            {booking.rideId}
                        </p>

                        <p>
                            Seats :
                            {booking.seatsBooked}
                        </p>

                        <p>
                            Status :
                            {booking.status}
                        </p>

                        <button
                            onClick={() =>
                                cancelBooking(
                                    booking.bookingId
                                )
                            }
                        >
                            Cancel
                        </button>

                    </div>
                ))
            }

        </div>
    );
}

export default MyBookingsPage;