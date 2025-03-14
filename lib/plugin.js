const fs = require('fs').promises;
const path = require('path');
const toml = require('toml');

/**
 * A small Serverless plugin for pyproject.toml compatibility.
 */
class PyprojectPlugin {
    static tags = ['build'];

    /**
     * Initialize this plugin instance.
     */
    constructor(serverless) {
        this.hooks = {
            initialize: async () => {
                // read in the pyproject.toml as a parsed object we can navigate
                let pyprojectPath = path.join(serverless.serviceDir, 'pyproject.toml');
                let pyprojectStr = await fs.readFile(pyprojectPath);
                let pyproject = toml.parse(pyprojectStr.toString());

                // add any extras the developer requested in the configuration
                for (let extra of sls.service.custom?.pyproject?.extras || []) {
                    for (let module of pyproject.project['optional-dependencies'][extra] || []) {
                        pyproject.project.dependencies.push(module);
                    }
                }

                // join back all dependencies as a newline separated string
                let requirementsPath = path.join(serverless.serviceDir, 'requirements.txt');
                let requirementsStr = pyproject.project.dependencies.join('\n') + '\n';

                // ...and write it over the existing requirements.txt
                return fs.writeFile(requirementsPath, requirementsStr);
            }
        };
    }
}

// export the plugin for Serverless
module.exports = PyprojectPlugin;
