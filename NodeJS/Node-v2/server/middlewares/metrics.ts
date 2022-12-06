import Probe from '../commons/probe';
import Config from '../../config';

const metricName = 'metricName';
const probe = Probe.configure(Config.statsD);

const initializeProbe = () => {
    return (req, res, next) => {
        const startTime = Date.now();

        const report = () => {
            const metric = req[metricName];
            if (metric) {
                const key = `${req.method}.${metric}`;
                probe.increment(`${key}.total_requests`);

                const { statusCode } = res;
                probe.increment(`${key}.status_code.${statusCode}`);
                if (statusCode >= 400 && statusCode <= 499) {
                    probe.increment(`${key}.status_code.4xx`);
                } else if (statusCode >= 500 && statusCode <= 599) {
                    probe.increment(`${key}.status_code.5xx`);
                }

                const responseTime = Date.now() - startTime;
                probe.timing(`${key}.response_time`, responseTime);
            }
        };

        res.probe = probe;

        res.once('finish', report);

        next();
    };
};

const trackMetric = key => (req, res, next) => {
    req[metricName] = key;
    next();
};

export { initializeProbe, trackMetric };