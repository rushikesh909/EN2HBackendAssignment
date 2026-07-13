import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { BookingStatus } from './booking-status.enum';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { ServicesService } from '../services/services.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly servicesService: ServicesService,
  ) {}

  async create(dto: CreateBookingDto) {
    // Business rule: booking must belong to an existing service.
    await this.servicesService.findOne(dto.serviceId);

    // Business rule: booking dates cannot be in the past.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const requestedDate = new Date(dto.bookingDate);
    if (requestedDate < today) {
      throw new BadRequestException('Booking date cannot be in the past');
    }

    const booking = this.bookingRepository.create(dto);
    return this.bookingRepository.save(booking);
  }

  findAll() {
    return this.bookingRepository.find({ relations: { service: true } });
  }

  async findOne(id: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: { service: true },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    return booking;
  }

  async updateStatus(id: string, dto: UpdateBookingStatusDto) {
    const booking = await this.findOne(id);

    // Business rule: cancelled bookings cannot be marked as completed.
    if (
      booking.status === BookingStatus.CANCELLED &&
      dto.status === BookingStatus.COMPLETED
    ) {
      throw new BadRequestException(
        'A cancelled booking cannot be marked as completed',
      );
    }

    booking.status = dto.status;
    return this.bookingRepository.save(booking);
  }

  async cancel(id: string) {
    const booking = await this.findOne(id);
    booking.status = BookingStatus.CANCELLED;
    return this.bookingRepository.save(booking);
  }
}
