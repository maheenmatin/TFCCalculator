import {GET} from "@/app/api/alloy/route";
import {Alloy} from "@/app/types";
import {NextResponse} from 'next/server';
import alloys from '@/app/data/alloys.json';


jest.mock('next/server', () => ({
	NextResponse: {
		json: jest.fn(),
	},
}));

describe('GET api/alloys/', () => {
	it('should return 200 with all alloys as JSON', async() => {
		await GET();

		expect(NextResponse.json).toHaveBeenCalledWith((alloys as { alloys: Alloy[] }).alloys);
	});
});
