from setuptools import setup

exec (open('dash_composed/version.py').read())

setup(
    name='dash_composed',
    version=__version__,
    author='johncomposed',
    packages=['dash_composed'],
    include_package_data=True,
    license='MIT',
    description='Dash UI component suite',
    install_requires=[]
)
