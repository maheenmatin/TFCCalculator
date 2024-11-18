import {GET} from "@/api/metal/route";
import {SmeltingOutput} from "@/types";
import {NextResponse} from 'next/server';
import metals from '@/data/metals.json';


jest.mock('next/server', () => ({
	NextResponse: {
		json: jest.fn(),
	},
}));

describe('GET api/metals/', () => {
	it('should return 200 with all metals as JSON', async() => {
		await GET();

		expect(NextResponse.json).toHaveBeenCalledWith((metals as { metals: SmeltingOutput[] }).metals);
	});
});
