#!/bin/sh +x

echo "executing xware_bash.sh"
# 该脚本所在的目录
SELF_DIR=$(dirname $0)

# ETM 工作目录
ETM_SYSTEM_PATH=""

# ETM 磁盘检测配置文件
ETM_DISK_CFG_PATH=""

# ETM 配置文件路径
ETM_CFG_PATH=""

# 日志配置文件路径
LOG_CFG_PATH=""

# 指定ETM使用的deviceid，主要用于远程控制
ETM_DEVICEID=""

# 指定ETM使用的硬件ID，主要用于license验证
ETM_HARDWAREID=""

# ETM 进程的pid文件
ETM_PID_FILE_PATH=""

# ETM 使用的license
ETM_LICENSE=""

# ETM与hubble使用的pipe_path
PIPE_PATH=""

# ETM与hubble使用的本地端口
LC_PORT="19000"

# ETM 启动的参数
ETM_ARGS=""

# HUB 日志配置文件路径
HUBBLE_LOG_PATH=""

# hubble 启动的参数
HUB_ARGS=""

set_etm_system_path()
{
	ETM_SYSTEM_PATH="${SELF_DIR}"
	mkdir -p $ETM_SYSTEM_PATH
}

set_disk_cfg_path()
{
	ETM_DISK_CFG_PATH="${SELF_DIR}/thunder_mounts.cfg"
}

set_etm_cfg_path()
{
	ETM_CFG_PATH="${SELF_DIR}/etm.ini"
}

set_log_cfg_path()
{
	LOG_CFG_PATH="${SELF_DIR}/log.ini"
}

set_hubble_log_path()
{
	HUBBLE_LOG_PATH="${SELF_DIR}/hubble_log.ini"
}

set_etm_pid_file_path()
{
	ETM_PID_FILE_PATH="${SELF_DIR}/xunlei.pid"
}

set_etm_license()
{
	ETM_LICENSE="1508062001000004u0000007vub32aatrnhgtpuwdz"
}

set_etm_listen_addr()
{
	ETM_LISTEN_ADDR="0.0.0.0:${LC_PORT}"
}

set_etm_import_v1v2_mode()
{
	ETM_IMPORT_V1V2_MODE="2"
}

set_pipe_path()
{
	PIPE_PATH="${ETM_SYSTEM_PATH}/etm_hubble_report.pipe"
}

assemble_etm_args()
{
	if [ -n "$ETM_SYSTEM_PATH" ]; then
		ETM_ARGS="$ETM_ARGS --system_path=$ETM_SYSTEM_PATH"
	fi
	if [ -n "$ETM_DISK_CFG_PATH" ]; then
		ETM_ARGS="$ETM_ARGS --disk_cfg=$ETM_DISK_CFG_PATH"
	fi
	if [ -n "$ETM_CFG_PATH" ]; then
		ETM_ARGS="$ETM_ARGS --etm_cfg=$ETM_CFG_PATH"
	fi
	if [ -n "$LOG_CFG_PATH" ]; then
		ETM_ARGS="$ETM_ARGS --log_cfg=$LOG_CFG_PATH"
	fi
	if [ -n "$ETM_DEVICEID" ]; then
		ETM_ARGS="$ETM_ARGS --deviceid=$ETM_DEVICEID"
	fi
	if [ -n "$ETM_HARDWAREID" ]; then
		ETM_ARGS="$ETM_ARGS --hardwareid=$ETM_HARDWAREID"
	fi
	if [ -n "$ETM_PID_FILE_PATH" ]; then
		ETM_ARGS="$ETM_ARGS --pid_file=$ETM_PID_FILE_PATH"
	fi
	if [ -n "$ETM_LICENSE" ]; then
		ETM_ARGS="$ETM_ARGS --license=$ETM_LICENSE"
	fi
	if [ -n "$ETM_IMPORT_V1V2_MODE" ]; then
		ETM_ARGS="$ETM_ARGS --import_v1v2_mode=$ETM_IMPORT_V1V2_MODE"
	fi
	if [ -n "$ETM_LISTEN_ADDR" ]; then
		ETM_ARGS="$ETM_ARGS --listen_addr=$ETM_LISTEN_ADDR"
	fi
	if [ -n "$PIPE_PATH" ]; then
		ETM_ARGS="$ETM_ARGS --hubble_report_pipe_path=$PIPE_PATH"
	fi
}

assemble_hub_args()
{
	#HUB_ARGS="--wait_resp_timeout=20 --report_interval=5 " 
	#HUB_ARGS="$HUB_ARGS --hubble_server_addr=t05b020vm3.sandai.net:9999 "
	if [ -n "$ETM_SYSTEM_PATH" ]; then
		HUB_ARGS="$HUB_ARGS --system_path=$ETM_SYSTEM_PATH"
	fi
	if [ -n "$PIPE_PATH" ]; then
		HUB_ARGS="$HUB_ARGS --hubble_report_pipe_path=$PIPE_PATH"
	fi
	if [ -n "$LC_PORT" ]; then
		HUB_ARGS="$HUB_ARGS --lc_port=$LC_PORT"
	fi
	if [ -n "$HUBBLE_LOG_PATH" ]; then
		HUB_ARGS="$HUB_ARGS --hubble_log_cfg=$HUBBLE_LOG_PATH"
	fi
	if [ -n "$ETM_CFG_PATH" ]; then
		HUB_ARGS="$HUB_ARGS --etm_cfg=$ETM_CFG_PATH"
	fi
	
}

start_etm()
{
	#pkill hubble
	#echo "executing ${SELF_DIR}/hubble $HUB_ARGS $@"
	#( ${SELF_DIR}/hubble $HUB_ARGS $@ & )
	echo "executing ${SELF_DIR}/etm_xware $ETM_ARGS $@"
	( ${SELF_DIR}/etm_xware $ETM_ARGS $@ & )
	( ${SELF_DIR}/vod_httpserver & )
}

stop_etm()
{
	echo "stopping vod_httpserver"
	pkill vod_httpserver
	if [ -f $ETM_PID_FILE_PATH ]; then
		pid=`cat $ETM_PID_FILE_PATH`
		echo "stopping etm_xware pid=$pid"
		kill -9 $pid
	else
		echo "Failed! Kill process \"etm_xware\" manually!"
	fi
	#echo "stopping hubble"
	#pkill hubble
}

check_etm_status()
{
	RET_FILE="${SELF_DIR}/etm_info"
	#time_begin=`date +%s`
	#wget -O$RET_FILE http://127.0.0.1:19000/getsysinfo &> /dev/null
	process=`ps`
	echo ${process} | grep "etm_xware" > /dev/null
	ret_val=$?
	if [ $ret_val -ne 0 ]; then
		#time_end=`date +%s`
		#time_elapsed=$((time_end-time_begin))
		#if [ $time_elapsed -ge 60 ]; then 
		#	echo "[`date`] service timeout!!!!"
		#	return 2 # service timeout
   		#fi
		echo "[`date`] sevice not avaliable!!!!"
		return 1 #service not avaliable
	fi
	#echo "[`date`] service OK!!!"
	return 0 #service OK
}

etm_monitor()
{
	timeout_count=0
	while [ 1 -gt 0 ]; do
		check_etm_status
		check_ret=$?
		if [ $check_ret -eq 1 ]; then
			start_etm $@
			timeout_count=0
		elif [ $check_ret -eq 2 ]; then
			timeout_count=$((++timeout_count))
			if [ $timeout_count -ge 5 ]; then
				stop_etm
				start_etm $@
				timeout_count=0
			fi
		else
			timeout_count=0
		fi
		sleep 3
	done
}

set_etm_system_path
set_disk_cfg_path
set_etm_cfg_path
set_log_cfg_path
set_hubble_log_path
set_etm_pid_file_path
set_etm_license
set_etm_import_v1v2_mode
set_etm_listen_addr
set_pipe_path

assemble_etm_args
assemble_hub_args

etm_monitor $@
