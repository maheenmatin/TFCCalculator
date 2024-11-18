import { GET } from '@/api/metal/[metal]/minerals/route';


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

// Mock production metals JSON
jest.mock('@/data/metals.json', () => ({
	metals: [
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

describe('GET /api/metal/[metal]/minerals', () => {
	it('should return minerals data when metal exists', async () => {
		const params = { params: { metalName: encodeURIComponent('Steel') } };
		const request = mockRequest('http://localhost/api/metal/Steel/minerals');

		const response = await GET(request, params);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual([
			                     { name: 'Hematite', produces: 'Iron', uses: ['vessel', 'bloomery'] },
			                     { name: 'Coal', produces: 'Carbon', uses: ['bloomery'] },
		                     ]);
	});

	it('should return 404 when metal does not exist', async () => {
		const params = { params: { metalName: encodeURIComponent('nonexistent') } };
		const request = mockRequest('http://localhost/api/metal/nonexistent/minerals');

		const response = await GET(request, params);
		const data = await response.json();

		expect(response.status).toBe(404);
		expect(data).toEqual({ message: 'Metal not found' });
	});

	it('should return minerals data while being case-insensitive', async () => {
		const params = { params: { metalName: encodeURIComponent('bRoNzE') } };
		const request = mockRequest('http://localhost/api/metal/bRoNzE/minerals');

		const response = await GET(request, params);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual([
			                     { name: 'Chalcopyrite', produces: 'Copper', uses: ['vessel', 'crucible'] },
			                     { name: 'Cassiterite', produces: 'Tin', uses: ['vessel', 'crucible'] },
		                     ]);
	});

	it('should filter minerals by uses when provided', async () => {
		const params = { params: { metalName: encodeURIComponent('Steel') } };
		const request = mockRequest('http://localhost/api/metal/Steel/minerals?uses=vessel');

		const response = await GET(request, params);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual([
			                     { name: 'Hematite', produces: 'Iron',  uses: ['vessel', 'bloomery'] },
		                     ]);
	});

	it('should handle multiple use filters', async () => {
		const params = { params: { metalName: encodeURIComponent('Steel') } };
		const request = mockRequest('http://localhost/api/metal/Steel/minerals?uses=vessel&uses=bloomery');

		const response = await GET(request, params);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual([
			                     { name: 'Hematite', produces: 'Iron', uses: ['vessel', 'bloomery'] },
			                     { name: 'Coal', produces: 'Carbon', uses: ['bloomery'] },
		                     ]);
	});
});
