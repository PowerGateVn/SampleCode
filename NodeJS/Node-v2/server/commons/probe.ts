import Lynx from 'lynx';

class Probe {
    static configure(config) {
        const { host = null, port = null, env = null } = config || {};

        if (!(host && port && env)) {
            global.loggerServer.warn(
                'No config found for statsD, running without metric tracking'
            );
            return new NoOpProbe();
        }

        return new StatsDProbe(host, port, env);
    }

    increment(metric: any) { }

    timing(metric: any, time: any) { }
}

class NoOpProbe extends Probe { }

class StatsDProbe extends Probe {
    statsD: any;

    constructor(host, port, env) {
        super();
        const options = {
            prefix: `beam_api_${env}`
        };
        this.statsD = new Lynx(host, port, options);
    }

    increment(metric) {
        this.statsD.increment(metric);
    }

    timing(metric, time) {
        this.statsD.timing(metric, time);
    }
}

export default Probe;