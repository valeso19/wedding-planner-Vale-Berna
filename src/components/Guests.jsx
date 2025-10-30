import React, { useState } from 'react';

function Guests({ guests, onUpdateGuests, onBack }) {
  const [filter, setFilter] = useState('all');

  const filteredGuests = guests.filter(guest => {
    if (filter === 'all') return true;
    if (filter === 'pagado') return guest.paid >= guest.amountToPay;
    if (filter === 'debe') return guest.paid < guest.amountToPay;
    if (filter === 'no-confirmado') return !guest.confirmed;
  });

  const addGuest = () => {
    const name = prompt('Nombre:');
    const companions = prompt('Acompañantes (opcional):') || 0;
    const amountToPay = prompt('Monto a pagar:') || 0;
    if (name) onUpdateGuests([...guests, { name, companions: parseInt(compan
