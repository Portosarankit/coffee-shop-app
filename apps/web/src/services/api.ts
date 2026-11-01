import { io, Socket } from 'socket.io-client';

const API_BASE = '/api';

export class ApiClient {
  private static socket: Socket | null = null;

  static async getMenu() {
    const res = await fetch(`${API_BASE}/menu`);
    if (!res.ok) {
      throw new Error('Failed to fetch menu');
    }
    const json = await res.json();
    return json.data;
  }

  static async createOrder(payload: any) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error?.message || 'Failed to create order');
    }
    return json.data;
  }

  static getSocket(): Socket {
    if (!this.socket) {
      this.socket = io();
    }
    return this.socket;
  }
}
