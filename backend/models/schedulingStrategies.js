// models/schedulingStrategies.js

// Base strategy class
// (can't use it directly, just for other strategies to extend)
class SchedulingStrategy {
  constructor() {
    if (new.target === SchedulingStrategy) {
      throw new Error("This base class can't be used directly");
    }
  }

  // Every strategy must have its own validate function
  async validate(newAppt, existingAppointments) {
    throw new Error("validate() needs to be written in child class");
  }

  // quick helper: work out start and end time from an appointment
  getTimeRange(appt) {
    const start = new Date(appt.appointDate).getTime();
    const end = start + appt.duration * 60000; // convert mins to ms
    return { start, end };
  }
}

// Strict = no overlaps at all
class StrictStrategy extends SchedulingStrategy {
  async validate(newAppt, existingAppointments) {
    const { start: newStart, end: newEnd } = this.getTimeRange(newAppt);

    return !existingAppointments.some((a) => {
      if (a.vetName !== newAppt.vetName) return false; // only check same vet
      const { start: existingStart, end: existingEnd } = this.getTimeRange(a);

      return newStart < existingEnd && newEnd > existingStart; // overlap check
    });
  }
}

// Buffer = gap between appointments (default 15 min)
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

// Relaxed = only blocks if start times are exactly the same
class RelaxedStrategy extends SchedulingStrategy {
  async validate(newAppt, existingAppointments) {
    return !existingAppointments.some(
      (a) =>
        a.vetName === newAppt.vetName &&
        new Date(a.appointDate).getTime() === new Date(newAppt.appointDate).getTime()
    );
  }
}

// Priority = emergencies always allowed, else same as strict
class PriorityStrategy extends SchedulingStrategy {
  async validate(newAppt, existingAppointments) {
    if (newAppt.reason && newAppt.reason.toLowerCase() === "emergency") {
      return true; // let emergencies through
    }

    const { start: newStart, end: newEnd } = this.getTimeRange(newAppt);

    return !existingAppointments.some((a) => {
      if (a.vetName !== newAppt.vetName) return false;
      const { start: existingStart, end: existingEnd } = this.getTimeRange(a);

      return newStart < existingEnd && newEnd > existingStart;
    });
  }
}

// Flexible = allows small overlaps (default 20 mins)
// Flexible = allows small overlaps (default 20 mins)
class FlexibleStrategy extends SchedulingStrategy {
  constructor(overlapMinutes = 20) {  // default is now 20 minutes
    super();
    this.overlapMinutes = overlapMinutes;
  }

  async validate(newAppt, existingAppointments) {
    const { start: newStart, end: newEnd } = this.getTimeRange(newAppt);

    return !existingAppointments.some((a) => {
      if (a.vetName !== newAppt.vetName) return false;
      const { start: existingStart, end: existingEnd } = this.getTimeRange(a);

      // calculate actual overlap (in ms)
      const overlap =
        Math.min(newEnd, existingEnd) - Math.max(newStart, existingStart);

      // reject only if overlap is bigger than 20 mins
      return overlap > this.overlapMinutes * 60000;
    });
  }
}

// export them so routes can use them
module.exports = {
  StrictStrategy,
  BufferStrategy,
  RelaxedStrategy,
  PriorityStrategy,
  FlexibleStrategy,
};
