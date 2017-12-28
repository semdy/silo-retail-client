
nowa build --mangle
#scp dist/* root@192.168.45.136:/usr/share/nginx/html/report

rsync -a -e 'ssh -p 22' --stats --progress ./vendors/* root@58.87.100.125:/opt/silo/web/report/vendors
scp dist/* root@58.87.100.125:/usr/share/nginx/html/report
#scp dist/* root@58.87.100.125:/opt/silo/web/report
