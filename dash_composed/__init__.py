import os as _os
import dash as _dash
import sys as _sys
from .version import __version__
import datetime as dt

_current_path = _os.path.dirname(_os.path.abspath(__file__))

_components = _dash.development.component_loader.load_components(
    _os.path.join(_current_path, 'metadata.json'),
    'dash_composed'
)

_this_module = _sys.modules[__name__]

_external_url = "http://localhost:9000/bundle.js?" + str(int(dt.datetime.now().timestamp()))\
    if "dash-composed/dash_composed" in _current_path\
    else "https://cdn.rawgit.com/johncomposed/dash-composed-components/v"\
        + __version__ + "/dash_composed/bundle.js"

_js_dist = [
    {
        "relative_package_path": "bundle.js",
        "external_url": _external_url,
        "namespace": "dash_composed"
    }
]

_css_dist = []


for _component in _components:
    setattr(_this_module, _component.__name__, _component)
    setattr(_component, '_js_dist', _js_dist)
    setattr(_component, '_css_dist', _css_dist)
