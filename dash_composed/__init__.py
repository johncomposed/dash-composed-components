import os as _os
import dash as _dash
import sys as _sys
from .version import __version__

_current_path = _os.path.dirname(_os.path.abspath(__file__))

_components = _dash.development.component_loader.load_components(
    _os.path.join(_current_path, 'metadata.json'),
    'dash_composed'
)

_this_module = _sys.modules[__name__]

# "external_url": (
#     "https://unpkg.com/dash-composed@{}"
#     "/dash_composed/bundle.js"
# ).format(__version__),

_js_dist = [
    {
        "relative_package_path": "bundle.js",
        "external_url": "https://cdn.rawgit.com/johncomposed/dash-composed-components/eab3178b/dash_composed/bundle.js",
        "namespace": "dash_composed"
    }
]

_css_dist = []


for _component in _components:
    setattr(_this_module, _component.__name__, _component)
    setattr(_component, '_js_dist', _js_dist)
    setattr(_component, '_css_dist', _css_dist)
