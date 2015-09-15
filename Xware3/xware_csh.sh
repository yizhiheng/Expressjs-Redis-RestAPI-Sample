#!csh

# 该脚本所在的目录
#set SELF_DIR=$(dirname $0)
set SELF_DIR="."
#echo "SELF_DIR=${SELF_DIR}"
echo "executing xware_csh.sh"

# ETM 工作目录
set ETM_SYSTEM_PATH=""

# ETM 磁盘检测配置文件
set ETM_DISK_CFG_PATH=""

# ETM 配置文件路径
set ETM_CFG_PATH=""

# 日志配置文件路径
set LOG_CFG_PATH=""

# 指定ETM使用的deviceid，主要用于远程控制
set ETM_DEVICEID=""

# 指定ETM使用的硬件ID，主要用于license验证
set ETM_HARDWAREID=""

# ETM 进程的pid文件
set ETM_PID_FILE_PATH=""

# ETM 使用的license
set ETM_LICENSE=""

# ETM与hubble使用的pipe_path
set PIPE_PATH=""

# ETM与hubble使用的本地端口
set LC_PORT="19000"

# ETM 启动的参数
set ETM_ARGS=""

# hubble 日志配置文件路径
set HUBBLE_LOG_PATH=""

# hubble 启动的参数
set HUB_ARGS=""

set ETM_SYSTEM_PATH="${SELF_DIR}"
#mkdir -p $ETM_SYSTEM_PATH
set ETM_DISK_CFG_PATH="${SELF_DIR}/thunder_mounts.cfg"
set ETM_CFG_PATH="${SELF_DIR}/etm.ini"
set LOG_CFG_PATH="${SELF_DIR}/log.ini"
set HUBBLE_LOG_PATH="${SELF_DIR}/hubble_log.ini"
set ETM_PID_FILE_PATH="${SELF_DIR}/xunlei.pid"
set ETM_LICENSE="1508062001000004u0000007vub32aatrnhgtpuwdz"
set ETM_LISTEN_ADDR="0.0.0.0:${LC_PORT}"
set ETM_IMPORT_V1V2_MODE="2"
#set PIPE_PATH="/tmp/my_fifo"
set PIPE_PATH="${ETM_SYSTEM_PATH}/etm_hubble_report.pipe"

if (  "" !=  "$ETM_SYSTEM_PATH" )  then
	set ETM_ARGS="$ETM_ARGS --system_path=$ETM_SYSTEM_PATH"
endif

if ( "" != "$ETM_DISK_CFG_PATH" ) then
	set ETM_ARGS="$ETM_ARGS --disk_cfg=$ETM_DISK_CFG_PATH"
endif
if ( "" != "$ETM_CFG_PATH" ) then
	set ETM_ARGS="$ETM_ARGS --etm_cfg=$ETM_CFG_PATH"
endif
if ( "" != "$LOG_CFG_PATH" ) then
	set ETM_ARGS="$ETM_ARGS --log_cfg=$LOG_CFG_PATH"
endif
if ( "" != "$ETM_DEVICEID" ) then
	set ETM_ARGS="$ETM_ARGS --deviceid=$ETM_DEVICEID"
endif
if ( "" != "$ETM_HARDWAREID" ) then
	set ETM_ARGS="$ETM_ARGS --hardwareid=$ETM_HARDWAREID"
endif
if ( "" != "$ETM_PID_FILE_PATH" ) then
	set ETM_ARGS="$ETM_ARGS --pid_file=$ETM_PID_FILE_PATH"
endif
if ( "" != "$ETM_LICENSE" ) then
	set ETM_ARGS="$ETM_ARGS --license=$ETM_LICENSE"
endif
if ( "" != "$ETM_IMPORT_V1V2_MODE" ) then
	set ETM_ARGS="$ETM_ARGS --import_v1v2_mode=$ETM_IMPORT_V1V2_MODE"
endif
if ( "" != "$ETM_LISTEN_ADDR" ) then
	set ETM_ARGS="$ETM_ARGS --listen_addr=$ETM_LISTEN_ADDR"
endif
if ( "" != "$PIPE_PATH" ) then
	set ETM_ARGS="$ETM_ARGS --hubble_report_pipe_path=$PIPE_PATH"
endif
# HUB ARGS
#set HUB_ARGS="--wait_resp_timeout=20 --report_interval=5 " 
#set HUB_ARGS="$HUB_ARGS --hubble_server_addr=t05b020vm3.sandai.net:9999 "
if ( "" !=  "$ETM_SYSTEM_PATH" ) then
	set HUB_ARGS="$HUB_ARGS --system_path=$ETM_SYSTEM_PATH"
endif
if ( "" !=  "$PIPE_PATH" ) then
	set HUB_ARGS="$HUB_ARGS --hubble_report_pipe_path=$PIPE_PATH"
endif
if ( "" !=  "${LC_PORT}" ) then
	set HUB_ARGS="$HUB_ARGS --lc_port=${LC_PORT}"
endif
if ( "" != "${HUBBLE_LOG_PATH}" ) then
	set HUB_ARGS="$HUB_ARGS --hubble_log_path=${HUBBLE_LOG_PATH}"
endif
if ( "" != "${ETM_CFG_PATH}" ) then
	set HUB_ARGS="$HUB_ARGS --etm_cfg=${ETM_CFG_PATH}"
endif

set timeout_count=0
while ( 1 )
	#check_etm_status
	set process=`ps`
	echo ${process} | grep "etm_xware" > /dev/null
	set ret_val=$?
	set check_ret=0
	if ( ${ret_val} != 0 ) then
		echo "sevice not avaliable\!"
		set check_ret=1 
	else
		#echo "service OK\!"
		set check_ret=0
	endif

	if ( $check_ret == 1 ) then
		
		#pkill hubble
		#start_etm $*
		#echo "executing ${SELF_DIR}/hubble $HUB_ARGS $*"
		#( ${SELF_DIR}/hubble $HUB_ARGS $* & )
		echo "executing ${SELF_DIR}/etm_xware $ETM_ARGS $*"
		( ${SELF_DIR}/etm_xware $ETM_ARGS $* & )
		( ${SELF_DIR}/vod_httpserver & )

	endif
	sleep 3
end
