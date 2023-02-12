import { write_to_log_file } from './graph_api_call';
// import { ramp_upTime_calc } from './graph_api_call';

test('write_to_log_file returns 0', () => {
    const result = write_to_log_file();
    expect(result).toBe(0);
});