export interface QueueTicket {
  _id: string;
  queueNumber: string;
  queueDate: string;
  status: 'waiting' | 'registered';
  createdAt: string;
}

export interface Visitor {
  _id?: string;
  queueNumber?: string;
  queueDate?: string;
  name: string;
  idNumber?: string;
  gender?: string;
  birthDate?: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  department: string;
  doctor?: string;
  visitType?: string;
  complaint?: string;
  remark?: string;
  createdAt?: string;
}

export interface VisitorQuery {
  search?: string;
  department?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc' | '';
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

// Departments (poli) and their doctors, used by the input form and the list filter.
export const DEPARTMENTS: { name: string; doctors: string[] }[] = [
  { name: 'General Practitioner', doctors: ['dr. Andi Wijaya', 'dr. Sari Lestari'] },
  { name: 'Internal Medicine', doctors: ['dr. Budi Hartono, Sp.PD', 'dr. Maya Putri, Sp.PD'] },
  { name: 'Pediatrics', doctors: ['dr. Rina Kusuma, Sp.A', 'dr. Hendra Gunawan, Sp.A'] },
  { name: 'Obstetrics & Gynecology', doctors: ['dr. Dewi Anggraini, Sp.OG'] },
  { name: 'Dental', doctors: ['drg. Yusuf Pratama', 'drg. Lina Marlina'] },
  { name: 'Ophthalmology', doctors: ['dr. Fajar Nugroho, Sp.M'] },
  { name: 'ENT', doctors: ['dr. Taufik Hidayat, Sp.THT'] },
  { name: 'Cardiology', doctors: ['dr. Agus Salim, Sp.JP'] }
];

export const VISIT_TYPES = ['General', 'BPJS', 'Insurance'];
