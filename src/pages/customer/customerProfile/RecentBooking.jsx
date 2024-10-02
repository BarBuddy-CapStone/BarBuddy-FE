import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import BookingService from '../../../lib/service/bookingService';
import { addHours, addDays, isBefore } from 'date-fns';