import { GET } from '@/api/alloy/[alloyName]/minerals/route';


// Mock Request
const mockRequest = (url: string) => ({
	method: 'GET',
	url
} as unknown as Request);

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
jest.mock('@/data/alloys.json', () => ({
	alloys: [
		{
			name: 'Steel',
			components: [
				{ mineral: 'Iron', min: 96, max: 98 },
				{ mineral: 'Carbon', min: 2, max: 4 }
			]
		},
		{
			name: 'Bronze',
			components: [
				{ mineral: 'Copper', min: 80, max: 88 },
				{ mineral: 'Tin', min: 12, max: 20 }
			]
		},
	],
}));

// Mock production minerals JSON
jest.mock('@/data/minerals.json', () => ({
	Iron: [{ name: 'Hematite', uses: ['vessel', 'bloomery'] }],
	Carbon: [{ name: 'Coal', uses: ['bloomery'] }],
	Copper: [{ name: 'Chalcopyrite', uses: ['vessel', 'crucible'] }],
	Tin: [{ name: 'Cassiterite', uses: ['vessel', 'crucible'] }],
}));

describe('GET /api/alloy/[alloyName]/minerals', () => {
	it('should return minerals data when alloy exists', async () => {
		const params = { params: { alloyName: encodeURIComponent('Steel') } };
		const request = mockRequest('http://localhost/api/alloy/Steel/minerals');

		const response = await GET(request, params);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual([
			                     { name: 'Hematite', produces: 'Iron', uses: ['vessel', 'bloomery'] },
			                     { name: 'Coal', produces: 'Carbon', uses: ['bloomery'] },
		                     ]);
	});

	it('should return 404 when alloy does not exist', async () => {
		const params = { params: { alloyName: encodeURIComponent('nonexistent') } };
		const request = mockRequest('http://localhost/api/alloy/nonexistent/minerals');

		const response = await GET(request, params);
		const data = await response.json();

		expect(response.status).toBe(404);
		expect(data).toEqual({ message: 'Alloy not found' });
	});

	it('should return minerals data while being case-insensitive', async () => {
		const params = { params: { alloyName: encodeURIComponent('bRoNzE') } };
		const request = mockRequest('http://localhost/api/alloy/bRoNzE/minerals');

		const response = await GET(request, params);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual([
			                     { name: 'Chalcopyrite', produces: 'Copper', uses: ['vessel', 'crucible'] },
			                     { name: 'Cassiterite', produces: 'Tin', uses: ['vessel', 'crucible'] },
		                     ]);
	});

	it('should filter minerals by uses when provided', async () => {
		const params = { params: { alloyName: encodeURIComponent('Steel') } };
		const request = mockRequest('http://localhost/api/alloy/Steel/minerals?uses=vessel');

		const response = await GET(request, params);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual([
			                     { name: 'Hematite', produces: 'Iron',  uses: ['vessel', 'bloomery'] },
		                     ]);
	});

	it('should handle multiple use filters', async () => {
		const params = { params: { alloyName: encodeURIComponent('Steel') } };
		const request = mockRequest('http://localhost/api/alloy/Steel/minerals?uses=vessel&uses=bloomery');

		const response = await GET(request, params);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual([
			                     { name: 'Hematite', produces: 'Iron', uses: ['vessel', 'bloomery'] },
			                     { name: 'Coal', produces: 'Carbon', uses: ['bloomery'] },
		                     ]);
	});
});
