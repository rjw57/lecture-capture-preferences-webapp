# Lecture Capture Preferences Web Application

**TODO: THIS README NEEDS COMPLETING**

This repository contains a simple web application allowing lecturers to record
their preferences for lecture capture.

## Documentation

The project has detailed documentation for developers, including a "getting
started" guide. See below for information on building the documentation.

## Useful developer links

When a development environment is created via ``./compose.sh development up``,
the following endpoints are available:

* http://localhost:8000/ - the web application itself.
* http://localhost:7000/ - a Swagger UI instance configured to point to the
    application's REST-ful API.

## Developer quickstart

Firstly, [install docker-compose](https://docs.docker.com/compose/install/).

Then, most tasks can be performed via the ``compose.sh`` script:

```bash
# Start development server
$ ./compose.sh development

# Start development server in background
$ ./compose.sh development up -d

# View logs
$ ./compose.sh development logs

# Stop the development server
$ ./compose.sh development down

# Run tests
$ ./compose.sh tox run --rm tox

# Start a server using the production Docker image
$ ./compose.sh production build
$ ./compose.sh production up -d
$ ./compose.sh production exec production_app ./manage.py migrate

# Build documentation and write a code coverage report to build/
$ COMPOSE_ARGS="-v $PWD/build/:/tmp/tox-data/artefacts/" ./tox.sh 
```

Additionally the ``tox.sh`` and ``manage_development.sh`` wrapper scripts
provide convenient ways to run ``tox`` and management commands:

```bash
# Rebuild all testenvs
$ ./tox.sh -r

# Run only the flake8 tests
$ ./tox.sh -e flake8

# Run the migrate management command using the development images
$ ./manage_development.sh migrate

# Run tests and write coverage/documentation to build directory
$ ./compose.sh tox run -v $PWD:/tmp/workspace -e TOXINI_ARTEFACT_DIR=/tmp/workspace/build --rm tox
```

## Notes on debugging

The Full-screen console debugger `pudb` has been included to allow you to run a debug in the
docker-compose environment. To use, simply set the breakpoint using `import pdb; pdb.set_trace()`
and attach to the container using:

```bash
docker attach preferences_development_app_1
```

For a fuller description of how to debug follow the 
[guide to debugging with pdb and Docker](https://blog.lucasferreira.org/howto/2017/06/03/running-pdb-with-docker-and-gunicorn.html)
(it works just as well for `pudb`).

## CircleCI configuration

TODO: [ADD DETAILS HERE ON WHAT CONFIGURATION IS REQUIRED FOR CIRCLECI/OTHER CI/CD.]

## Copyright License

See the [LICENSE](LICENSE.md) file for details.
