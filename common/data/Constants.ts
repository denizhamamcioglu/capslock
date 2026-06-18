import * as path from 'path';

export class Constants {
    static readonly TIMEOUT = 45000;
    static readonly OPTIONAL_WAIT_TIMEOUT = 20000;
    static readonly SCRIPT_TIMEOUT = 120000;
    static readonly TEST_TIMEOUT = 60000;
    static readonly DELAY_AMOUNT = 500;
    static readonly POLL_INTERVAL = 200;
    static readonly MAX_UI_TRY_COUNT = 150;
    static readonly RESOURCES_PATH = path.join(process.cwd(), 'resources');
    static readonly SHORTEST_WAIT = 1000;
    static readonly SHORT_WAIT = 1500;
    static readonly MEDIUM_WAIT = 3000;
    static readonly LONG_WAIT = 5000;
    static readonly LONGEST_WAIT = 8000;
    static readonly API_TIMEOUT = 20000;
    static readonly DEFAULT_DATE_FORMAT = 'DD/MM/YYYY - HH:mm';
}