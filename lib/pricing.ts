import type { BookingRequestInput, PriceEstimate, VehicleKey } from "@/lib/types";

interface PriceRule {
  key: string;
  routeKeys: string[];
  serviceKeys: string[];
  basePrice: number;
  durationMinutes: number;
  includedWaitingMinutes: number;
  vehicleMultipliers: Record<VehicleKey, number>;
  minimumByVehicle: Record<VehicleKey, number>;
}

export const priceRules: PriceRule[] = [
  {
    key: "airport-prague",
    routeKeys: ["airport"],
    serviceKeys: ["airport-pickup", "airport-dropoff"],
    basePrice: 55,
    durationMinutes: 45,
    includedWaitingMinutes: 45,
    vehicleMultipliers: { sedan: 1, "v-class": 1.45, minibus: 2.7, coach: 5.2 },
    minimumByVehicle: { sedan: 55, "v-class": 80, minibus: 150, coach: 285 }
  },
  {
    key: "chauffeur-prague",
    routeKeys: ["chauffeur"],
    serviceKeys: ["chauffeur"],
    basePrice: 70,
    durationMinutes: 60,
    includedWaitingMinutes: 0,
    vehicleMultipliers: { sedan: 1, "v-class": 1.35, minibus: 2.4, coach: 4.8 },
    minimumByVehicle: { sedan: 70, "v-class": 95, minibus: 165, coach: 330 }
  },
  {
    key: "prague-vienna",
    routeKeys: ["vienna"],
    serviceKeys: ["europe-transfer", "daily-tour"],
    basePrice: 390,
    durationMinutes: 240,
    includedWaitingMinutes: 30,
    vehicleMultipliers: { sedan: 1, "v-class": 1.35, minibus: 2.25, coach: 4.4 },
    minimumByVehicle: { sedan: 390, "v-class": 525, minibus: 875, coach: 1715 }
  },
  {
    key: "prague-dresden",
    routeKeys: ["dresden"],
    serviceKeys: ["europe-transfer", "daily-tour"],
    basePrice: 230,
    durationMinutes: 120,
    includedWaitingMinutes: 30,
    vehicleMultipliers: { sedan: 1, "v-class": 1.35, minibus: 2.25, coach: 4.4 },
    minimumByVehicle: { sedan: 230, "v-class": 310, minibus: 520, coach: 1015 }
  },
  {
    key: "prague-cesky",
    routeKeys: ["cesky"],
    serviceKeys: ["europe-transfer", "daily-tour", "program"],
    basePrice: 260,
    durationMinutes: 180,
    includedWaitingMinutes: 30,
    vehicleMultipliers: { sedan: 1, "v-class": 1.35, minibus: 2.25, coach: 4.4 },
    minimumByVehicle: { sedan: 260, "v-class": 350, minibus: 585, coach: 1145 }
  }
];

export function vehicleKeyFromInput(vehicle?: string, passengers = 1): VehicleKey {
  const normalized = (vehicle || "").toLowerCase();
  if (normalized.includes("coach") || passengers > 20) return "coach";
  if (normalized.includes("minibus") || passengers > 7) return "minibus";
  if (normalized.includes("v-class") || normalized.includes("v class") || passengers > 3) return "v-class";
  return "sedan";
}

export function calculatePriceEstimate(input: BookingRequestInput): PriceEstimate {
  const vehicle = vehicleKeyFromInput(input.vehicle, input.passengers);
  const rule = priceRules.find((candidate) => {
    const routeMatch = input.route ? candidate.routeKeys.includes(input.route) : false;
    const serviceMatch = input.service ? candidate.serviceKeys.includes(input.service) : true;
    return routeMatch && serviceMatch;
  });

  if (!rule) {
    return {
      status: "manual_review",
      currency: "EUR",
      total: null,
      breakdown: [],
      notes: ["No known route pricing rule matched this request."]
    };
  }

  const multiplier = rule.vehicleMultipliers[vehicle];
  const base = roundToFive(Math.max(rule.basePrice * multiplier, rule.minimumByVehicle[vehicle]));
  const breakdown = [{ label: `${rule.key} ${vehicle}`, amount: base }];
  const notes = [`Estimated duration: ${rule.durationMinutes} minutes.`];
  let total = base;

  if (input.trip_type === "roundtrip") {
    const roundTripDiscountedReturn = roundToFive(base * 0.9);
    breakdown.push({ label: "Round-trip return leg", amount: roundTripDiscountedReturn });
    total += roundTripDiscountedReturn;
  }

  if (isNightPickup(input.pickup_time)) {
    const surcharge = roundToFive(total * 0.15);
    breakdown.push({ label: "Night surcharge", amount: surcharge });
    notes.push("Night surcharge applies for pickups between 22:00 and 06:00.");
    total += surcharge;
  }

  return {
    status: "estimated",
    currency: "EUR",
    total: roundToFive(total),
    ruleKey: rule.key,
    breakdown,
    notes
  };
}

function isNightPickup(time: string): boolean {
  const hour = Number(time.slice(0, 2));
  return hour >= 22 || hour < 6;
}

function roundToFive(value: number): number {
  return Math.round(value / 5) * 5;
}
