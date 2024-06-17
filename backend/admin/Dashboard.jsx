import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ApiClient } from 'adminjs';
import { Box, H3, Button, Loader } from '@adminjs/design-system';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
                <p className="label">{`Data de ${label}`}</p>
                <p className="intro">{`Nr rezervări: ${payload[0].value}`}</p>
            </div>
        );
    }

    return null;
};

const Dashboard = () => {
    const [bookingData, setBookingData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [months, setMonths] = useState([]);
    const [showLoader, setShowLoader] = useState(false);
    const [antrenoriLiberi, setAntrenoriLiberi] = useState('');
    const api = new ApiClient();

    const generateMonthOptions = () => {
        const monthNames = [
            'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
        ];
        const monthsArray = [];
        for (let i = 0; i < 12; i++) {
            const monthValue = (i + 1).toString().padStart(2, '0');
            monthsArray.push({ value: monthValue, label: monthNames[i] });
        }
        return monthsArray;
    };

    useEffect(() => {
        const monthsOptions = generateMonthOptions();
        setMonths(monthsOptions);
    }, []);

    const downloadResource = async (name) => {
        const res = await api.resourceAction({
            resourceId: name,
            actionName: 'list'
        });
        return res.data.records;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await downloadResource('booking');
                const bookingsByDay = {};
                for (let booking of data) {
                    const month = booking.params.bookingDate.split("-")[1];
                    if (month == selectedMonth) {
                        const day = booking.params.bookingDate.split("-")[2];
                        bookingsByDay[day] = (bookingsByDay[day] || 0) + 1;
                    }
                }

                const chartData = Object.keys(bookingsByDay).map(day => ({
                    name: parseInt(day),
                    value: bookingsByDay[day],
                }));
                setBookingData(chartData);
            } catch (error) {
                console.error('Error fetching booking data:', error);
            }
        };

        fetchData();
    }, [selectedMonth]);

    const downloadCsv = (continut, nume) => {
        let csvData = new Blob([continut], { type: `text/csv;charset=utf-8;` });
        let csvUrl = URL.createObjectURL(csvData);

        const a = document.createElement('a');
        a.href = csvUrl;
        a.download = nume;
        a.click();
    };

    const csvTrainers = async () => {
        setShowLoader(true);
        const trainers = await downloadResource('trainer');
        const bookings = await downloadResource('booking');

        let csvContent = 'Nr.Crt, Nume, Vârstă, Gen, Preț, Specializare, Dată, Oră\n';
        let i = 1;
        trainers.forEach((trainer) => {
            const t = trainer.params;
            const trainerBookings = bookings.filter(booking => booking.params.trainerId === trainer.params._id);
            trainerBookings.forEach((booking) => {
                let row = `${i}, ${t.name}, ${t.age}, ${t.gender}, ${t.price}, ${t.specialization}, ${booking.params.bookingDate}, ${booking.params.bookingSlot}`;
                csvContent += row + '\r\n';
                i++;
            })
        });

        downloadCsv(csvContent, 'antrenori.csv');
        setShowLoader(false);
    };

    const handleAntrenoriLiberi = async () => {
        setShowLoader(true);
        if (antrenoriLiberi.length > 0) {
            setAntrenoriLiberi('');
            return;
        }
        const trainers = await downloadResource('trainer');
        let bookings = await downloadResource('booking');

        const lista = [];
        trainers.forEach((trainer) => {
            const t = trainer.params;
            const trainerBookings = bookings.filter(booking => booking.params.trainerId === trainer.params.id);
            const bookingsToday = [];
            trainerBookings.forEach(b => {
                const month = b.params.bookingDate.split("-")[1];
                const day = b.params.bookingDate.split("-")[2];
                const today = new Date();
                if (month == today.getMonth() + 1 && day == today.getDate()) {
                    bookingsToday.push(b);
                }
            });
            if (bookingsToday.length == 0) {
                lista.push(t);
            }
        });
        setAntrenoriLiberi(lista);
        setShowLoader(false);
    };

    return (
        <div style={{ margin: "30px" }}>
            <h2 style={{ marginBottom: "20px" }}>Numărul rezervărilor în fiecare zi</h2>
            <div style={{ marginBottom: "20px" }}>
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                    <option value="">Alege o lună</option>
                    {months.map(month => (
                        <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                </select>
            </div>
            {selectedMonth && bookingData.length > 0 && (
                <div>
                    <h3 style={{ marginBottom: "20px" }}>Rezervări pentru {months.find(m => m.value === selectedMonth)?.label} 2024</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={bookingData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
            {selectedMonth && !bookingData.length > 0 && (
                <div>
                    <h3 style={{ marginBottom: "20px" }}>Nu sunt rezervări pentru {months.find(m => m.value === selectedMonth)?.label} 2024</h3>
                </div>
            )}
            <Box variant='white' mt='30px'>
                <H3>Listă rezervări per antrenor</H3>
                <Button variant='primary' onClick={csvTrainers}>
                    Descarcă csv
                </Button>
            </Box>
            <Box variant='white' mt='30px'>
                <H3>Listă antrenori liberi astăzi</H3>
                <Button variant='primary' onClick={handleAntrenoriLiberi}>
                    {antrenoriLiberi.length === 0 ? 'Afișează' : 'Ascunde'}
                </Button>
                {antrenoriLiberi.length > 0 && (
                    <div>
                        {antrenoriLiberi.map((trainer, index) => (
                            <div key={index}>
                                <img src={trainer.image} alt={`Poză Antrenor ${index + 1}`} width="200px" height="200px" />
                                <h2>{trainer.name}</h2>
                                <p>Vârstă: {trainer.age}</p>
                                <p>Gen: {trainer.gender}</p>
                                <p>Specializare: {trainer.specialization}</p>
                                <p>Preț/oră: {trainer.price} lei</p>
                            </div>
                        ))}
                    </div>
                )}
            </Box>
            {showLoader && (
                <div
                    style={{
                        backgroundColor: 'rgba(204,204,204,0.3)',
                        height: '100vh',
                        width: '100vw',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default Dashboard;