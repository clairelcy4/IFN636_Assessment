// models/schedulingStrategies.js

class SchedulingStrategy {
  constructor() {
    if (new.target === SchedulingStrategy) {
      throw new Error("This base class can't be used directly");
    }
  }

  async validate(newAppt, existingAppointments) {
    throw new Error("validate() must be implemented in child class");
  }

  getTimeRange(appt) {
    const start = new Date(appt.appointDate).getTime();
    const end = start + appt.duration * 60000;
    return { start, end };
  }
}

// Strict = no overlaps at all
class StrictStrategy extends SchedulingStrategy {
  async validate(newAppt, existingAppointments) {
    const { start: newStart, end: newEnd } = this.getTimeRange(newAppt);

    return !existingAppointments.some((a) => {
      if (a.vetName !== newAppt.vetName) return false;
      const { start: existingStart, end: existingEnd } = this.getTimeRange(a);
      return newStart < existingEnd && newEnd > existingStart;
    });
  }
}

// Buffer = requires a gap (default 15 min)
class BufferStrategy extends SchedulingStrategy {
  constructor(bufferMinutes = 15) {
    super();
    this.bufferMinutes = bufferMinutes;
  }

  async validate(newAppt, existingAppointments) {
    const { start: newStart, end: newEnd } = this.getTimeRange(newAppt);

    return !existingAppointments.some((a) => {
      if (a.vetName !== newAppt.vetName) return false;
      const { start: existingStart, end: existingEnd } = this.getTimeRange(a);

      return (
        newStart < existingEnd + this.bufferMinutes * 60000 &&
        newEnd > existingStart - this.bufferMinutes * 60000
      );
    });
  }
}

// Relaxed = always allow overlaps
class RelaxedStrategy extends SchedulingStrategy {
  async validate() {
    return true;
  }
}

// Priority = emergencies always allowed, else strict
class PriorityStrategy extends SchedulingStrategy {
  async validate(newAppt, existingAppointments) {
    if (newAppt.reason && newAppt.reason.toLowerCase() === "emergency") {
      return true;
    }

    const { start: newStart, end: newEnd } = this.getTimeRange(newAppt);
    return !existingAppointments.some((a) => {
      if (a.vetName !== newAppt.vetName) return false;
      const { start: existingStart, end: existingEnd } = this.getTimeRange(a);
      return newStart < existingEnd && newEnd > existingStart;
    });
  }
}

// Flexible = allow small overlaps, reject large ones
class FlexibleStrategy extends SchedulingStrategy {
  constructor(overlapMinutes = 5) {
    super();
    this.overlapMinutes = overlapMinutes;
  }

  async validate(newAppt, existingAppointments) {
    const { start: newStart, end: newEnd } = this.getTimeRange(newAppt);

    return !existingAppointments.some((a) => {
      if (a.vetName !== newAppt.vetName) return false;
      const { start: existingStart, end: existingEnd } = this.getTimeRange(a);

      const overlap = Math.min(newEnd, existingEnd) - Math.max(newStart, existingStart);

      if (overlap > 0) {
        const overlapMinutes = overlap / 60000;
        // reject only if overlap is strictly larger than allowed
        return overlapMinutes > this.overlapMinutes;
      }
      return false;
    });
  }
}

module.exports = {
  StrictStrategy,
  BufferStrategy,
  RelaxedStrategy,
  PriorityStrategy,
  FlexibleStrategy,
};
