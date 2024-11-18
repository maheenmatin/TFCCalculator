import { GET } from '@/api/metal/[metal]/route';


// Mock Request
const mockRequest = { method: 'GET' } as Request;

// Mock Response
jest.mock('next/server', () => ({
	NextResponse: {
		json: jest.fn((body, options) => ({
			json: async () => body,
			status: options?.status || 200,
		})),
	},
}));

// Mock production metals JSON
jest.mock('@/data/metals.json', () => ({
	metals: [
		{ name: 'Stainless Steel', composition: { iron: 98, carbon: 2 } },
		{ name: 'Bronze', composition: { copper: 88, tin: 12 } },
	],
}));

describe('GET /api/metal/[metal]', () => {
	it('should return metal data when metal exists', async() => {
		const params = { params: { metalName: encodeURIComponent('Bronze') } };

		const response = await GET(mockRequest, params);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual({ name: 'Bronze', composition: { copper: 88, tin: 12 } });
	});

	it('should return 404 when metal does not exist', async() => {
		const params = { params: { metalName: encodeURIComponent('nonexistent') } };

		const response = await GET(mockRequest, params);
		const data = await response.json();

		expect(response.status).toBe(404);
		expect(data).toEqual({ error: 'Metal not found' });
	});

	it('should return metal data while being case-insensitive', async() => {
		const params = { params: { metalName: encodeURIComponent('BrOnZe') } };

		const response = await GET(mockRequest, params);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual({ name: 'Bronze', composition: { copper: 88, tin: 12 } });
	});

	it('should decode metal names when a misc character is present', async()=> {
		const params = { params: { metalName: encodeURIComponent('Stainless Steel') } };

		const response = await GET(mockRequest, params);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual({ name: 'Stainless Steel', composition: { iron: 98, carbon: 2 } });
	});
});
