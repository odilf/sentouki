# UOH File Browser

File browser for the UOH files. 

TODO: Expand readme.

## Docker instructions

### Build

```bash
docker build --pull --rm -f "Dockerfile" -t sveltekitdocker:latest "."
```

### Run 

```bash
docker run --rm -d -p 8080:8080/tcp sveltekitdocker:latest
```
