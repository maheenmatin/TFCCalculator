import { GET } from '@/app/api/alloy/[alloyName]/route';


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

// Mock production alloys JSON
jest.mock('@/app/data/alloys.json', () => ({
	alloys: [
		{ name: 'Stainless Steel', composition: { iron: 98, carbon: 2 } },
		{ name: 'Bronze', composition: { copper: 88, tin: 12 } },
	],
}));

describe('GET /api/alloy/[alloyName]', () => {
	it('should return alloy data when alloy exists', async() => {
		const params = { params: { alloyName: encodeURIComponent('Bronze') } };

		const response = await GET(mockRequest, params);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual({ name: 'Bronze', composition: { copper: 88, tin: 12 } });
	});

	it('should return 404 when alloy does not exist', async() => {
		const params = { params: { alloyName: encodeURIComponent('nonexistent') } };

		const response = await GET(mockRequest, params);
		const data = await response.json();

		expect(response.status).toBe(404);
		expect(data).toEqual({ error: 'Alloy not found' });
	});

	it('should return alloy data while being case-insensitive', async() => {
		const params = { params: { alloyName: encodeURIComponent('BrOnZe') } };

		const response = await GET(mockRequest, params);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual({ name: 'Bronze', composition: { copper: 88, tin: 12 } });
	});

	it('should decode alloy names when a misc character is present', async()=> {
		const params = { params: { alloyName: encodeURIComponent('Stainless Steel') } };

		const response = await GET(mockRequest, params);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual({ name: 'Stainless Steel', composition: { iron: 98, carbon: 2 } });
	});
});
